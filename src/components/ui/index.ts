// Design System Export Index
// Import from this file for cleaner imports throughout the app

// ===== ATOMS =====
export { Button } from '../atoms/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from '../atoms/Button';

export { Input } from '../atoms/Input';
export type { InputProps, InputSize, InputVariant } from '../atoms/Input';

export { Text } from '../atoms/Text';
export type { TextProps, TextVariant, TextColor, TextAlign, TextWeight } from '../atoms/Text';

export { Badge } from '../atoms/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from '../atoms/Badge';

export { Avatar } from '../atoms/Avatar';
export type { AvatarProps, AvatarSize } from '../atoms/Avatar';

export { Switch } from '../atoms/Switch';
export type { SwitchProps, SwitchSize } from '../atoms/Switch';

export { Checkbox } from '../atoms/Checkbox';
export type { CheckboxProps, CheckboxSize } from '../atoms/Checkbox';

export { Radio } from '../atoms/Radio';
export type { RadioProps, RadioSize } from '../atoms/Radio';

export { IconButton } from '../atoms/IconButton';
export type { IconButtonProps, IconButtonVariant, IconButtonSize } from '../atoms/IconButton';

export { Spinner, LoadingOverlay } from '../atoms/Spinner';
export type { SpinnerProps, SpinnerSize, SpinnerColor } from '../atoms/Spinner';

export { Divider } from '../atoms/Divider';
export type { DividerProps, DividerOrientation } from '../atoms/Divider';

export { Tooltip, SimpleTooltip } from '../atoms/Tooltip';
export type { TooltipProps, TooltipPlacement } from '../atoms/Tooltip';

export { 
  ProgressBar, 
  CircularProgress, 
  IndeterminateProgress 
} from '../atoms/ProgressBar';
export type { 
  ProgressBarProps, 
  CircularProgressProps, 
  ProgressVariant, 
  ProgressSize 
} from '../atoms/ProgressBar';

export {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonListItem,
  SkeletonList,
  SkeletonButton,
  SkeletonPage,
} from '../atoms/Skeleton';
export type { SkeletonProps, SkeletonVariant } from '../atoms/Skeleton';

export { Chip, ChipGroup } from '../atoms/Chip';
export type { ChipProps, ChipVariant, ChipSize, ChipGroupProps } from '../atoms/Chip';

export { Rating, ReviewRating, CompactRating } from '../atoms/Rating';
export type { RatingProps, RatingIcon, RatingSize, ReviewRatingProps, CompactRatingProps } from '../atoms/Rating';

export { Slider, RangeSlider } from '../atoms/Slider';
export type { SliderProps, SliderSize, RangeSliderProps } from '../atoms/Slider';

// 🆕 NEW INPUT ATOMS
export { CurrencyInput } from '../atoms/CurrencyInput';
export type { CurrencyInputProps } from '../atoms/CurrencyInput';

export { UrlInput } from '../atoms/UrlInput';
export type { UrlInputProps } from '../atoms/UrlInput';

// ===== MOLECULES =====
export { Card, CardHeader, CardBody, CardFooter } from '../molecules/Card';
export type { CardProps, CardVariant } from '../molecules/Card';

export { ListItem } from '../molecules/ListItem';
export type { ListItemProps } from '../molecules/ListItem';

export { SearchBar } from '../molecules/SearchBar';
export type { SearchBarProps } from '../molecules/SearchBar';

export { FormField } from '../molecules/FormField';
export type { FormFieldProps } from '../molecules/FormField';

export { Select } from '../molecules/Select';
export type { SelectProps, SelectOption } from '../molecules/Select';

export { RadioGroup } from '../molecules/RadioGroup';
export type { RadioGroupProps, RadioGroupOption } from '../molecules/RadioGroup';

export { Tabs, TabPanel } from '../molecules/Tabs';
export type { TabsProps, Tab } from '../molecules/Tabs';

export { Accordion } from '../molecules/Accordion';
export type { AccordionProps, AccordionItem } from '../molecules/Accordion';

export { ToastProvider, ToastItem, useToast } from '../molecules/Toast';
export type { Toast, ToastType, ToastPosition } from '../molecules/Toast';

export { DatePicker, DateRangePicker } from '../molecules/DatePicker';
export type { DatePickerProps, DateRangePickerProps } from '../molecules/DatePicker';

export { FileUpload, AvatarUpload } from '../molecules/FileUpload';
export type { FileUploadProps } from '../molecules/FileUpload';

export { DropdownMenu, ContextMenu } from '../molecules/DropdownMenu';
export type { DropdownMenuProps, DropdownMenuItem, ContextMenuProps } from '../molecules/DropdownMenu';

export { Popover, ConfirmPopover } from '../molecules/Popover';
export type { PopoverProps, PopoverPlacement, PopoverTrigger, ConfirmPopoverProps } from '../molecules/Popover';

export { Breadcrumbs, CollapsedBreadcrumbs } from '../molecules/Breadcrumbs';
export type { BreadcrumbsProps, BreadcrumbItem, CollapsedBreadcrumbsProps } from '../molecules/Breadcrumbs';

export { Pagination, SimplePagination, CompactPagination } from '../molecules/Pagination';
export type { PaginationProps, SimplePaginationProps, CompactPaginationProps } from '../molecules/Pagination';

export { Stepper, DotStepper } from '../molecules/Stepper';
export type { StepperProps, Step, DotStepperProps } from '../molecules/Stepper';

export { Timeline, CompactTimeline, HorizontalTimeline } from '../molecules/Timeline';
export type { TimelineProps, TimelineItem, CompactTimelineProps, HorizontalTimelineProps } from '../molecules/Timeline';

export { EmptyState, EmptySearch, EmptyInbox, EmptyFolder, EmptyUsers } from '../molecules/EmptyState';
export type { EmptyStateProps } from '../molecules/EmptyState';

export { StatsCard, StatsGroup } from '../molecules/StatsCard';
export type { StatsCardProps, StatsGroupProps } from '../molecules/StatsCard';

export { ColorPicker, SwatchGrid, GradientPicker } from '../molecules/ColorPicker';
export type { ColorPickerProps, SwatchGridProps, GradientPickerProps } from '../molecules/ColorPicker';

export { NotificationBanner, CookieBanner, UpdateBanner } from '../molecules/NotificationBanner';
export type { NotificationBannerProps, BannerVariant, BannerPosition, CookieBannerProps, UpdateBannerProps } from '../molecules/NotificationBanner';

export { AvatarGroup, StackedAvatarGroup } from '../molecules/AvatarGroup';
export type { AvatarGroupProps, StackedAvatarGroupProps } from '../molecules/AvatarGroup';

export { SegmentedControl, IconSegmentedControl } from '../molecules/SegmentedControl';
export type { SegmentedControlProps, SegmentOption, IconSegmentedControlProps } from '../molecules/SegmentedControl';

export { FloatingActionButton, SimpleFAB, ExtendedFAB } from '../molecules/FloatingActionButton';
export type { FloatingActionButtonProps, FABAction } from '../molecules/FloatingActionButton';

export { ConfettiEffect, SuccessConfetti, FireworksEffect, EmojiRain, useCelebration } from '../molecules/ConfettiEffect';
export type { ConfettiEffectProps } from '../molecules/ConfettiEffect';

export { ProgressSteps, AnimatedProgressSteps, LinearProgress, MultiProgress } from '../molecules/ProgressSteps';
export type { ProgressStepsProps, ProgressStep, LinearProgressProps, MultiProgressProps } from '../molecules/ProgressSteps';

export {
  ProductCardSkeleton,
  UserProfileSkeleton,
  TableSkeleton,
  ChatMessageSkeleton,
  DashboardStatsSkeleton,
  BlogPostSkeleton,
  TimelineSkeleton,
  FormSkeleton,
  CardGridSkeleton,
  NavigationSkeleton,
  CommentThreadSkeleton,
} from '../molecules/SkeletonLoaders';

// ===== ORGANISMS =====
export { Modal, ModalFooter } from '../organisms/Modal';
export type { ModalProps, ModalSize, ModalPosition } from '../organisms/Modal';

export { AlertDialog, ConfirmDialog } from '../organisms/AlertDialog';
export type { AlertDialogProps, AlertDialogVariant, ConfirmDialogProps } from '../organisms/AlertDialog';

export { DataTable, SimpleTable } from '../organisms/DataTable';
export type { DataTableProps, Column, SimpleTableProps } from '../organisms/DataTable';

export { CommandPalette, useCommandPalette } from '../organisms/CommandPalette';
export type { CommandPaletteProps, CommandItem } from '../organisms/CommandPalette';

export { ImageGallery, MasonryGallery } from '../organisms/ImageGallery';
export type { ImageGalleryProps, GalleryImage } from '../organisms/ImageGallery';

export { Carousel, ImageCarousel, CardCarousel } from '../organisms/Carousel';
export type { CarouselProps, CarouselItem, ImageCarouselProps, CardCarouselProps } from '../organisms/Carousel';

export { TreeView, FileExplorer, ExpandableList } from '../organisms/TreeView';
export type { TreeViewProps, TreeNode, FileExplorerProps, FileNode } from '../organisms/TreeView';

export { Drawer, NavDrawer, FilterDrawer } from '../organisms/Drawer';
export type { DrawerProps, DrawerPosition, DrawerSize, NavDrawerProps } from '../organisms/Drawer';

export { KanbanBoard } from '../organisms/KanbanBoard';
export type { KanbanBoardProps, KanbanColumn, KanbanCard } from '../organisms/KanbanBoard';

export { Calendar, CompactCalendar } from '../organisms/Calendar';
export type { CalendarProps, CalendarEvent } from '../organisms/Calendar';

export { AdvancedFileUpload } from '../organisms/AdvancedFileUpload';
export type { AdvancedFileUploadProps, UploadFile } from '../organisms/AdvancedFileUpload';

export { NotificationCenter } from '../organisms/NotificationCenter';
export type { NotificationCenterProps, Notification } from '../organisms/NotificationCenter';

// ===== ADDITIONAL MOLECULES =====
export { SplitPane, ThreePane } from '../molecules/SplitPane';
export type { SplitPaneProps, ThreePaneProps } from '../molecules/SplitPane';

export { InfiniteScroll, InfiniteGrid, useInfiniteScroll } from '../molecules/InfiniteScroll';
export type { InfiniteScrollProps, InfiniteGridProps } from '../molecules/InfiniteScroll';

export {
  SimpleLineChart,
  SimpleBarChart,
  SimpleAreaChart,
  SimplePieChart,
  DonutChart,
  Sparkline,
  MiniBarChart,
} from '../molecules/Charts';
export type {
  LineChartProps,
  BarChartProps,
  AreaChartProps,
  PieChartProps,
  SparklineProps,
  MiniBarChartProps,
} from '../molecules/Charts';

export { QuickActions, RadialMenu } from '../molecules/QuickActions';
export type { QuickActionsProps, QuickAction } from '../molecules/QuickActions';

export { VirtualList, VirtualGrid, DynamicVirtualList } from '../molecules/VirtualList';
export type { VirtualListProps, VirtualGridProps, DynamicVirtualListProps } from '../molecules/VirtualList';

// 🆕 NEW INPUT MOLECULES
export { OTPInput } from '../molecules/OTPInput';
export type { OTPInputProps } from '../molecules/OTPInput';

export { PhoneInput } from '../molecules/PhoneInput';
export type { PhoneInputProps, CountryCode } from '../molecules/PhoneInput';

export { CreditCardInput } from '../molecules/CreditCardInput';
export type { CreditCardInputProps, CardData } from '../molecules/CreditCardInput';

export { AutoComplete } from '../molecules/AutoComplete';
export type { AutoCompleteProps, AutoCompleteOption } from '../molecules/AutoComplete';

export { MultiSelect } from '../molecules/MultiSelect';
export type { MultiSelectProps, MultiSelectOption } from '../molecules/MultiSelect';

export { DateTimeInput } from '../molecules/DateTimeInput';
export type { DateTimeInputProps } from '../molecules/DateTimeInput';

// 🆕 BATCH 2: MORE ADVANCED INPUT MOLECULES
export { SliderInput } from '../molecules/SliderInput';
export type { SliderInputProps } from '../molecules/SliderInput';

export { ColorInput } from '../molecules/ColorInput';
export type { ColorInputProps } from '../molecules/ColorInput';

export { FileInput } from '../molecules/FileInput';
export type { FileInputProps } from '../molecules/FileInput';

export { LocationInput } from '../molecules/LocationInput';
export type { LocationInputProps, LocationData } from '../molecules/LocationInput';

export { RatingInput } from '../molecules/RatingInput';
export type { RatingInputProps } from '../molecules/RatingInput';

export { SignatureInput } from '../molecules/SignatureInput';
export type { SignatureInputProps } from '../molecules/SignatureInput';

export { ToggleGroup } from '../molecules/ToggleGroup';
export type { ToggleGroupProps, ToggleGroupOption } from '../molecules/ToggleGroup';

export { ComboBox } from '../molecules/ComboBox';
export type { ComboBoxProps, ComboBoxOption } from '../molecules/ComboBox';

export { MentionsInput } from '../molecules/MentionsInput';
export type { MentionsInputProps, MentionUser } from '../molecules/MentionsInput';

export { MarkdownInput } from '../molecules/MarkdownInput';
export type { MarkdownInputProps } from '../molecules/MarkdownInput';

// 🆕 BATCH 3: EVEN MORE ADVANCED INPUT MOLECULES
export { DateRangeInput } from '../molecules/DateRangeInput';
export type { DateRangeInputProps, DateRange } from '../molecules/DateRangeInput';

export { TimeInput } from '../molecules/TimeInput';
export type { TimeInputProps, TimeValue } from '../molecules/TimeInput';

export { ChipInput } from '../molecules/ChipInput';
export type { ChipInputProps } from '../molecules/ChipInput';

export { TreeSelect } from '../molecules/TreeSelect';
export type { TreeSelectProps, TreeNode } from '../molecules/TreeSelect';

export { TransferList } from '../molecules/TransferList';
export type { TransferListProps, TransferItem } from '../molecules/TransferList';

export { ImageCropInput } from '../molecules/ImageCropInput';
export type { ImageCropInputProps } from '../molecules/ImageCropInput';

export { DurationInput } from '../molecules/DurationInput';
export type { DurationInputProps, Duration } from '../molecules/DurationInput';

export { JSONInput } from '../molecules/JSONInput';
export type { JSONInputProps } from '../molecules/JSONInput';

export { WeekInput } from '../molecules/WeekInput';
export type { WeekInputProps, WeekValue } from '../molecules/WeekInput';

export { MonthInput } from '../molecules/MonthInput';
export type { MonthInputProps, MonthValue } from '../molecules/MonthInput';

// 🆕 NEW INPUT ORGANISMS
export { RichTextEditor } from '../organisms/RichTextEditor';
export type { RichTextEditorProps } from '../organisms/RichTextEditor';

export { CodeEditor, CodeBlock } from '../organisms/CodeEditor';
export type { CodeEditorProps } from '../organisms/CodeEditor';

// ===== HOOKS =====
export { useForm } from '../../hooks/useForm';
export type { UseFormConfig, ValidationRule } from '../../hooks/useForm';