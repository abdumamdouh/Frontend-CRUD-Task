export type ServiceCategory =
	| 'Transport'
	| 'Identity'
	| 'Healthcare'
	| 'Business'
	| 'Utilities'
	| 'Housing'
	| 'Education'
	| 'Employment'
	| 'Family'
	| 'Tourism';

export type ServiceStatus = 'Available' | 'Limited' | 'Maintenance';

export type ServiceTag =
	| 'Vehicles'
	| 'Individuals'
	| 'Business'
	| 'Renewal'
	| 'Application'
	| 'Appointment'
	| 'Certificate'
	| 'Payment Required'
	| 'Free'
	| 'Online'
	| 'Popular';

export interface Service {
	id: string;
	title: string;
	description: string;
	translations?: Partial<
		Record<'ar', { title?: string; description?: string }>
	>;
	category: ServiceCategory;
	status: ServiceStatus;
	tags: ServiceTag[];
	processingTime: number;
	processingTimeLabel: string;
	fee: number;
	feeLabel: string;
	isPopular: boolean;
	isFavorite: boolean;
	createdAt: string;
}

export interface ServiceFormValues {
	title: string;
	description: string;
	category: ServiceCategory | '';
	status: ServiceStatus;
	tags: ServiceTag[];
	processingTime: string;
	fee: string;
	isPopular: boolean;
}

export interface ServicePayload {
	title: string;
	description: string;
	category: ServiceCategory;
	status: ServiceStatus;
	tags: ServiceTag[];
	processingTime: number | string;
	fee: number | string;
	isPopular: boolean;
}

export type SortOption =
	| 'newest'
	| 'oldest'
	| 'title-az'
	| 'title-za'
	| 'processing-time'
	| 'fee-low'
	| 'fee-high';

export interface ServiceFilters {
	searchTerm: string;
	category: ServiceCategory | '';
	statuses: ServiceStatus[];
	tags: ServiceTag[];
	popularOnly: boolean;
}
