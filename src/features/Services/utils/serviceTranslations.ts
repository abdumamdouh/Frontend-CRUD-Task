import type {
	Service,
	ServiceCategory,
	ServiceStatus,
	ServiceTag,
} from '../types/service';

const isArabic = (language: string) => language.startsWith('ar');

const categoryArabic: Record<ServiceCategory, string> = {
	Transport: 'النقل',
	Identity: 'الهوية',
	Healthcare: 'الصحة',
	Business: 'الأعمال',
	Utilities: 'الخدمات العامة',
	Housing: 'الإسكان',
	Education: 'التعليم',
	Employment: 'التوظيف',
	Family: 'الأسرة',
	Tourism: 'السياحة',
};

const statusArabic: Record<ServiceStatus, string> = {
	Available: 'متاحة',
	Limited: 'محدودة',
	Maintenance: 'صيانة',
};

const tagArabic: Record<ServiceTag, string> = {
	Vehicles: 'المركبات',
	Individuals: 'الأفراد',
	Business: 'الأعمال',
	Renewal: 'تجديد',
	Application: 'طلب',
	Appointment: 'موعد',
	Certificate: 'شهادة',
	'Payment Required': 'يتطلب رسوماً',
	Free: 'مجانية',
	Online: 'إلكترونية',
	Popular: 'شائعة',
};

const categoryArabicDescription: Record<ServiceCategory, string> = {
	Transport:
		'توضح الخدمة المتطلبات وخطوات التقديم وتوفر تحديثات رقمية تساعد المتعامل على إكمال طلب النقل بثقة.',
	Identity:
		'يمكن للمتعاملين مراجعة متطلبات الهوية وإرسال البيانات المطلوبة ومتابعة حالة الطلب عبر القنوات الرسمية.',
	Healthcare:
		'تدعم الخدمة طلبات الرعاية الصحية للمقيمين وتعرض الخطوات المطلوبة بوضوح لتسهيل الإنجاز.',
	Business:
		'تساعد المنشآت على إدارة الطلب إلكترونياً ومراجعة الوثائق المطلوبة والحفاظ على سجلاتها التجارية محدثة.',
	Utilities:
		'يمكن للمتعامل إكمال طلب الخدمات رقمياً واستلام تحديثات واضحة حول الحساب أو حالة الربط.',
	Housing:
		'تجمع الخدمة تفاصيل الإسكان المطلوبة وتساعد المتعامل على تقديم الطلب ومتابعته من مكان واحد.',
	Education:
		'تدعم الخدمة الطلبات التعليمية الرسمية وتوضح المستندات والخطوات اللازمة لإكمال الإجراء.',
	Employment:
		'تساعد الأفراد أو المنشآت على استكمال طلبات العمل ومتابعة الحالة من خلال مسار رقمي واضح.',
	Family:
		'تتيح الخدمة تقديم الطلبات الأسرية الرسمية ومراجعة المتطلبات ومتابعة مراحل المعاملة بسهولة.',
	Tourism:
		'تساعد الزوار والمنشآت السياحية على إكمال الطلبات والحجوزات والحصول على تأكيد رقمي واضح.',
};

const extendArabicDescription = (
	service: Service,
	description: string,
	hasCustomTranslation: boolean
) => {
	if (hasCustomTranslation || description.length > 90) return description;
	return `${description} ${categoryArabicDescription[service.category]}`;
};

const serviceArabic: Record<string, { title: string; description: string }> = {
	'service-001': {
		title: 'تسجيل المركبة',
		description: 'تسجيل أو تجديد ملكية المركبة إلكترونياً.',
	},
	'service-002': {
		title: 'تجديد جواز السفر',
		description: 'تجديد جواز السفر الإماراتي ومتابعة حالة الطلب.',
	},
	'service-003': {
		title: 'موعد رعاية صحية',
		description: 'حجز أو تعديل أو إلغاء موعد في مركز صحي حكومي.',
	},
	'service-004': {
		title: 'تجديد الرخصة التجارية',
		description: 'تجديد رخصة تجارية لمنشأة قائمة في دولة الإمارات.',
	},
	'service-005': {
		title: 'توصيل الخدمات',
		description: 'طلب توصيل الكهرباء والمياه لمنزل أو مكتب.',
	},
	'service-006': {
		title: 'بدل فاقد لبطاقة الهوية الإماراتية',
		description: 'طلب بطاقة هوية إماراتية بديلة عند الفقدان أو التلف.',
	},
	'service-007': {
		title: 'تجديد رخصة القيادة',
		description: 'تجديد رخصة قيادة إماراتية والحصول على تأكيد رقمي.',
	},
	'service-008': {
		title: 'تصريح مواقف',
		description: 'طلب تصريح مواقف للسكان أو الزوار.',
	},
	'service-009': {
		title: 'حجز اسم تجاري',
		description: 'حجز اسم تجاري قبل إصدار الرخصة التجارية.',
	},
	'service-010': {
		title: 'طلب شهادة ضريبة القيمة المضافة',
		description: 'طلب شهادة تسجيل ضريبة القيمة المضافة لسجلات الشركة.',
	},
	'service-011': {
		title: 'شهادة ميلاد',
		description: 'طلب نسخة معتمدة من شهادة الميلاد.',
	},
	'service-012': {
		title: 'تصديق شهادة زواج',
		description: 'تقديم شهادة زواج للتصديق الحكومي.',
	},
	'service-013': {
		title: 'التسجيل المدرسي',
		description: 'طلب التسجيل في المدارس الحكومية للطلبة المؤهلين.',
	},
	'service-014': {
		title: 'طلب منحة دراسية',
		description: 'تقديم طلب منحة دراسية للبرامج التعليمية المعتمدة.',
	},
	'service-015': {
		title: 'طلب منحة إسكانية',
		description: 'طلب منحة إسكانية أو برنامج دعم للمواطنين.',
	},
	'service-016': {
		title: 'تسجيل عقد إيجار',
		description: 'تسجيل عقد الإيجار لدى الجهة المختصة.',
	},
	'service-017': {
		title: 'تسجيل باحث عن عمل',
		description: 'التسجيل كباحث عن عمل للحصول على دعم التوظيف الحكومي.',
	},
	'service-018': {
		title: 'تجديد تصريح عمل',
		description: 'تجديد تصريح عمل لموظف في شركة مسجلة.',
	},
	'service-019': {
		title: 'تمديد تأشيرة سياحية',
		description: 'طلب تمديد تأشيرة سياحية مؤهلة.',
	},
	'service-020': {
		title: 'حجز تذاكر المتاحف',
		description: 'حجز تذاكر لمتاحف ومواقع ثقافية حكومية مختارة.',
	},
	'service-021': {
		title: 'فحص اللياقة الطبية',
		description: 'حجز فحص اللياقة الطبية لإجراءات الإقامة.',
	},
	'service-022': {
		title: 'سجل التطعيمات',
		description: 'تنزيل سجل تطعيم رسمي.',
	},
	'service-023': {
		title: 'دفع مخالفات المركبات',
		description: 'عرض ودفع المخالفات المرورية المرتبطة بالمركبة.',
	},
	'service-024': {
		title: 'تعبئة بطاقة النقل العام',
		description: 'تعبئة رصيد بطاقة النقل العام إلكترونياً.',
	},
	'service-025': {
		title: 'شهادة حالة الإقامة',
		description: 'طلب شهادة تؤكد حالة الإقامة.',
	},
	'service-026': {
		title: 'تحديث خلاصة القيد',
		description: 'تحديث بيانات خلاصة القيد بعد الأحداث المؤهلة.',
	},
	'service-027': {
		title: 'بطاقة منشأة الشركة',
		description: 'طلب أو تجديد بطاقة منشأة لشركة.',
	},
	'service-028': {
		title: 'إقرار جمركي',
		description: 'تقديم إقرار جمركي للبضائع الواردة إلى دولة الإمارات.',
	},
	'service-029': {
		title: 'دفع فاتورة المياه',
		description: 'عرض ودفع فواتير المياه لحساب نشط.',
	},
	'service-030': {
		title: 'تقرير استهلاك الكهرباء',
		description: 'تنزيل تقارير استخدام الكهرباء للحساب.',
	},
	'service-031': {
		title: 'طلب رخصة بناء',
		description: 'طلب رخصة بناء للأراضي المعتمدة.',
	},
	'service-032': {
		title: 'شهادة ملكية أرض',
		description: 'طلب شهادة ملكية أرض.',
	},
	'service-033': {
		title: 'طلب كشف درجات',
		description: 'طلب كشف درجات رسمي من سجل تعليمي حكومي.',
	},
	'service-034': {
		title: 'تجديد رخصة معلم',
		description: 'تجديد رخصة مهنية للمعلم.',
	},
	'service-035': {
		title: 'مطالبة تأمين التعطل عن العمل',
		description: 'تقديم مطالبة للحصول على دعم تأمين التعطل عن العمل.',
	},
	'service-036': {
		title: 'بيان اشتراكات التقاعد',
		description: 'تنزيل بيان اشتراكات التقاعد.',
	},
	'service-037': {
		title: 'تصريح فعالية',
		description: 'طلب تصريح لفعالية عامة أو ترفيهية.',
	},
	'service-038': {
		title: 'شهادة تصنيف فندق',
		description: 'طلب تفاصيل شهادة تصنيف فندق.',
	},
	'service-039': {
		title: 'بطاقة كبار المواطنين',
		description: 'طلب بطاقة مزايا لكبار المواطنين.',
	},
	'service-040': {
		title: 'بطاقة أصحاب الهمم',
		description: 'طلب بطاقة خدمة لأصحاب الهمم.',
	},
	'service-041': {
		title: 'تجديد رخصة عيادة',
		description: 'تجديد رخصة تشغيل عيادة خاصة.',
	},
	'service-042': {
		title: 'شكوى تأمين صحي',
		description: 'تقديم شكوى بشأن مزود تأمين صحي.',
	},
	'service-043': {
		title: 'تصريح إغلاق طريق',
		description: 'طلب الموافقة على أعمال إغلاق طريق مؤقتة.',
	},
	'service-044': {
		title: 'تصريح حجز مركبة أجرة',
		description: 'طلب تصريح نقل ركاب تجاري.',
	},
	'service-045': {
		title: 'ترشيح الإقامة الذهبية',
		description: 'تقديم طلب ترشيح للأهلية للحصول على الإقامة الذهبية.',
	},
	'service-046': {
		title: 'حالة تصريح الدخول',
		description: 'التحقق من حالة طلب تصريح الدخول.',
	},
	'service-047': {
		title: 'تسجيل دعم الشركات الصغيرة والمتوسطة',
		description: 'تسجيل شركة صغيرة أو متوسطة في برامج الدعم الحكومي.',
	},
	'service-048': {
		title: 'شكوى تجارية',
		description: 'تقديم شكوى بشأن معاملة تجارية.',
	},
	'service-049': {
		title: 'طلب جمع النفايات',
		description: 'طلب جمع النفايات كبيرة الحجم من مسكن.',
	},
	'service-050': {
		title: 'توصيل الألواح الشمسية',
		description: 'طلب ربط الألواح الشمسية بشبكة الخدمات.',
	},
};

export const translateCategory = (
	category: ServiceCategory,
	language: string
) => (isArabic(language) ? categoryArabic[category] : category);

export const translateStatus = (status: ServiceStatus, language: string) =>
	isArabic(language) ? statusArabic[status] : status;

export const translateTag = (tag: ServiceTag, language: string) =>
	isArabic(language) ? tagArabic[tag] : tag;

export const formatServiceDuration = (minutes: number, language: string) =>
	isArabic(language) ? `${minutes} دقائق` : `${minutes} minutes`;

export const formatServiceFee = (fee: number, language: string) => {
	if (fee === 0) return isArabic(language) ? 'مجانية' : 'Free';
	return String(fee);
};

export const getLocalizedService = (service: Service, language: string) => {
	const customArabicTranslation = service.translations?.ar;

	const translation = isArabic(language)
		? {
				...serviceArabic[service.id],
				...customArabicTranslation,
			}
		: undefined;

	const translatedDescription = translation?.description
		? extendArabicDescription(
				service,
				translation.description,
				Boolean(customArabicTranslation?.description)
			)
		: undefined;

	return {
		title: translation?.title ?? service.title,
		description: translatedDescription ?? service.description,
		category: translateCategory(service.category, language),
		status: translateStatus(service.status, language),
		tags: service.tags.map((tag) => translateTag(tag, language)),
		processingTimeLabel: formatServiceDuration(
			service.processingTime,
			language
		),
		feeLabel: formatServiceFee(service.fee, language),
	};
};
