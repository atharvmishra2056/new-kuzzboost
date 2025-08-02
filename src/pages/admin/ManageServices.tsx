import { useState, useEffect, ReactElement } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SiInstagram, SiYoutube, SiDiscord, SiTwitch, SiSpotify, SiWhatsapp, SiSnapchat, SiX } from 'react-icons/si';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

// --- Interfaces and Data ---
interface ServiceTier {
    quantity: number;
    price: number;
}
interface Service {
    id: number;
    title: string;
    platform: string;
    iconName: string;
    icon?: ReactElement;
    tiers: ServiceTier[];
    rating: number;
    reviews: number;
    features: string[];
    description: string;
    badge: string;
    refill_eligible: boolean;
}

const iconMap: { [key: string]: ReactElement } = {
    SiInstagram: <SiInstagram className="w-6 h-6 text-[#E4405F]" />,
    SiYoutube: <SiYoutube className="w-6 h-6 text-[#FF0000]" />,
    SiX: <SiX className="w-6 h-6 text-[#000000]" />,
    SiDiscord: <SiDiscord className="w-6 h-6 text-[#7289DA]" />,
    SiTwitch: <SiTwitch className="w-6 h-6 text-[#9146FF]" />,
    SiSpotify: <SiSpotify className="w-6 h-6 text-[#1DB954]" />,
    SiWhatsapp: <SiWhatsapp className="w-6 h-6 text-[#25D366]" />,
    SiSnapchat: <SiSnapchat className="w-6 h-6 text-[#FFFC00]" />,
};

// --- Zod Schema for Validation ---
const serviceSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long."),
    platform: z.string().min(1, "Platform is required."),
    iconName: z.string().min(1, "Icon name is required."),
    badge: z.string().min(1, "Badge is required."),
    description: z.string().min(10, "Description must be at least 10 characters long."),
    rating: z.coerce.number().min(0).max(5),
    reviews: z.coerce.number().min(0),
    features: z.array(z.object({ value: z.string().min(1, "Feature cannot be empty.") })),
    tiers: z.array(z.object({
        quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
        price: z.coerce.number().min(1, "Price must be at least 1."),
    })).min(1, "At least one price tier is required."),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

const ManageServices = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ServiceFormData>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            features: [{ value: "" }],
            tiers: [{ quantity: 1000, price: 100 }]
        }
    });

    const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({ control, name: "features" });
    const { fields: tierFields, append: appendTier, remove: removeTier } = useFieldArray({ control, name: "tiers" });

    const fetchServices = async () => {
        setLoading(true);
        try {
            const { data: servicesData, error: servicesError } = await supabase
                .from('services')
                .select('*')
                .order('id');
            if (servicesError) {
                toast.error('Failed to fetch services.');
                throw servicesError;
            }

            const { data: tiersData, error: tiersError } = await supabase
                .from('service_tiers')
                .select('*');
            if (tiersError) {
                toast.error('Failed to fetch service tiers.');
                throw tiersError;
            }

            const servicesWithTiers = servicesData.map(service => {
                const serviceTiers = tiersData.filter(tier => tier.service_id === service.id);
                return {
                    ...service,
                    icon: iconMap[service.icon_name],
                    iconName: service.icon_name,
                    tiers: serviceTiers.map(({ quantity, price }) => ({ quantity, price })),
                    refill_eligible: service.refill_eligible ?? false,
                };
            });

            setServices(servicesWithTiers);
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleOpenDialog = (service: Service | null = null) => {
        setEditingService(service);
        if (service) {
            reset({
                ...service,
                features: service.features.map(f => ({ value: f })),
                tiers: service.tiers.length > 0 ? service.tiers : [{ quantity: 1000, price: 100 }]
            });
        } else {
            reset({
                title: '', platform: '', iconName: '', badge: '', description: '',
                rating: 4.5, reviews: 0, features: [{ value: '' }], tiers: [{ quantity: 1000, price: 100 }]
            });
        }
        setIsDialogOpen(true);
    };

    const handleRefillToggle = async (service: Service) => {
        const newStatus = !service.refill_eligible;

        setServices(currentServices =>
            currentServices.map(s =>
                s.id === service.id ? { ...s, refill_eligible: newStatus } : s
            )
        );

        try {
            const { error } = await supabase
                .from('services')
                .update({ refill_eligible: newStatus })
                .eq('id', service.id);

            if (error) throw error;

            toast.success(`'${service.title}' refill status updated.`);
        } catch (error) {
            console.error("Error updating refill status: ", error);
            toast.error("Failed to update refill status.");
            setServices(currentServices =>
                currentServices.map(s =>
                    s.id === service.id ? { ...s, refill_eligible: !newStatus } : s
                )
            );
        }
    };

    const onSubmit = async (data: ServiceFormData) => {
        try {
            const serviceData = {
                ...(editingService ? { id: editingService.id } : {}),
                title: data.title,
                platform: data.platform,
                icon_name: data.iconName,
                badge: data.badge,
                description: data.description,
                rating: data.rating,
                reviews: data.reviews,
                features: data.features.map(f => f.value),
                refill_eligible: editingService ? editingService.refill_eligible : false,
            };

            const { data: savedService, error: serviceError } = await supabase
                .from('services')
                .upsert(serviceData)
                .select()
                .single();

            if (serviceError) throw serviceError;

            const serviceId = savedService.id;

            await supabase.from('service_tiers').delete().eq('service_id', serviceId);

            const tiersToInsert = data.tiers.map(tier => ({
                service_id: serviceId,
                quantity: tier.quantity,
                price: tier.price,
            }));

            const { error: tiersError } = await supabase.from('service_tiers').insert(tiersToInsert);

            if (tiersError) throw tiersError;

            toast.success(`Service '${savedService.title}' has been ${editingService ? 'updated' : 'created'} successfully.`);
            setIsDialogOpen(false);
            await fetchServices();
        } catch (error) {
            console.error("Error saving service: ", error);
            toast.error('Failed to save service.');
        }
    };

    const handleDelete = async (serviceId: number, serviceTitle: string) => {
        if (window.confirm(`Are you sure you want to delete the service: "${serviceTitle}"?`)) {
            try {
                const { error } = await supabase.from('services').delete().eq('id', serviceId);
                if (error) throw error;
                toast.success(`Service '${serviceTitle}' deleted successfully.`);
                await fetchServices();
            } catch (error) {
                console.error("Error deleting service: ", error);
                toast.error('Failed to delete service.');
            }
        }
    };

    if (loading) return <div className="text-center py-10">Loading Services...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Services</h1>
                <Button onClick={() => handleOpenDialog()}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Service
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl glass">
                    <DialogHeader>
                        <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto pr-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" {...register("title")} />
                                {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="platform">Platform</Label>
                                <Input id="platform" {...register("platform")} />
                                {errors.platform && <p className="text-red-500 text-xs">{errors.platform.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="iconName">Icon Name (e.g., SiInstagram)</Label>
                                <Input id="iconName" {...register("iconName")} />
                                {errors.iconName && <p className="text-red-500 text-xs">{errors.iconName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="badge">Badge</Label>
                                <Input id="badge" {...register("badge")} />
                                {errors.badge && <p className="text-red-500 text-xs">{errors.badge.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rating">Rating</Label>
                                <Input id="rating" type="number" step="0.1" {...register("rating")} />
                                {errors.rating && <p className="text-red-500 text-xs">{errors.rating.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reviews">Reviews</Label>
                                <Input id="reviews" type="number" {...register("reviews")} />
                                {errors.reviews && <p className="text-red-500 text-xs">{errors.reviews.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" {...register("description")} />
                            {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Features</Label>
                            {featureFields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-2">
                                    <Input {...register(`features.${index}.value`)} />
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeFeature(index)}><Trash2 className="h-4 w-4"/></Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => appendFeature({ value: '' })}>Add Feature</Button>
                            {errors.features && <p className="text-red-500 text-xs">{errors.features.root?.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Price Tiers</Label>
                            {tierFields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
                                    <Input type="number" placeholder="Quantity" {...register(`tiers.${index}.quantity`)} />
                                    <Input type="number" placeholder="Price" {...register(`tiers.${index}.price`)} />
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeTier(index)}><Trash2 className="h-4 w-4"/></Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => appendTier({ quantity: 0, price: 0 })}>Add Tier</Button>
                            {errors.tiers && <p className="text-red-500 text-xs">{errors.tiers.root?.message || errors.tiers.message}</p>}
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save Service</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="glass rounded-2xl p-6 mt-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Icon</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Platform</TableHead>
                            <TableHead className="text-center">Refill Eligible</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map((service) => (
                            <TableRow key={service.id}>
                                <TableCell>{service.id}</TableCell>
                                <TableCell>{service.icon}</TableCell>
                                <TableCell className="font-medium">{service.title}</TableCell>
                                <TableCell>{service.platform}</TableCell>
                                <TableCell className="text-center">
                                    <Switch
                                        checked={service.refill_eligible}
                                        onCheckedChange={() => handleRefillToggle(service)}
                                        aria-label="Toggle refill eligibility"
                                    />
                                </TableCell>
                                <TableCell className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(service)}><Edit className="h-4 w-4"/></Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id, service.title)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ManageServices;