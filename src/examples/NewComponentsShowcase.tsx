/**
 * NEW COMPONENTS SHOWCASE
 * 
 * Demonstrates the 6 new components added to the design system:
 * 1. Toast - Notifications
 * 2. Tooltip - Hover information
 * 3. ProgressBar - Loading indicators
 * 4. Skeleton - Loading placeholders
 * 5. DatePicker - Date selection
 * 6. FileUpload - File upload with preview
 */

import React, { useState } from 'react';
import { Info, HelpCircle, Upload } from 'lucide-react';
import {
  Card,
  Text,
  Button,
  Divider,
  ToastProvider,
  useToast,
  Tooltip,
  SimpleTooltip,
  ProgressBar,
  CircularProgress,
  IndeterminateProgress,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonList,
  DatePicker,
  DateRangePicker,
  FileUpload,
  AvatarUpload,
} from '../components/ui';

function ToastExamples() {
  const toast = useToast();

  return (
    <Card variant="elevated" padding="lg">
      <Text variant="h3" className="mb-adaptive">
        Toast Notifications
      </Text>
      <Text variant="body" color="muted" className="mb-adaptive">
        Beautiful toast notifications with 4 variants
      </Text>

      <div className="grid grid-cols-2 gap-adaptive-sm">
        <Button
          variant="primary"
          onClick={() => toast.success('Success!', 'Your action was completed')}
        >
          Success Toast
        </Button>
        <Button
          variant="danger"
          onClick={() => toast.error('Error!', 'Something went wrong')}
        >
          Error Toast
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.warning('Warning!', 'Please check this')}
        >
          Warning Toast
        </Button>
        <Button
          variant="ghost"
          onClick={() => toast.info('Info', 'Just letting you know')}
        >
          Info Toast
        </Button>
      </div>
    </Card>
  );
}

function TooltipExamples() {
  return (
    <Card variant="elevated" padding="lg">
      <Text variant="h3" className="mb-adaptive">
        Tooltips
      </Text>
      <Text variant="body" color="muted" className="mb-adaptive">
        Hover over buttons to see tooltips in different positions
      </Text>

      <div className="flex flex-wrap gap-adaptive">
        <Tooltip content="This is a top tooltip" placement="top">
          <Button variant="secondary" icon={Info}>
            Top
          </Button>
        </Tooltip>

        <Tooltip content="This is a bottom tooltip" placement="bottom">
          <Button variant="secondary" icon={Info}>
            Bottom
          </Button>
        </Tooltip>

        <Tooltip content="This is a left tooltip" placement="left">
          <Button variant="secondary" icon={Info}>
            Left
          </Button>
        </Tooltip>

        <Tooltip content="This is a right tooltip" placement="right">
          <Button variant="secondary" icon={Info}>
            Right
          </Button>
        </Tooltip>

        <SimpleTooltip text="Simple tooltip helper">
          <Button variant="ghost" icon={HelpCircle}>
            Simple
          </Button>
        </SimpleTooltip>
      </div>
    </Card>
  );
}

function ProgressBarExamples() {
  const [progress, setProgress] = useState(45);

  return (
    <Card variant="elevated" padding="lg">
      <Text variant="h3" className="mb-adaptive">
        Progress Bars
      </Text>

      <div className="space-adaptive-y-lg">
        {/* Linear Progress */}
        <div>
          <Text variant="body" className="mb-2">
            Linear Progress ({progress}%)
          </Text>
          <ProgressBar value={progress} showLabel label="Upload Progress" />
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setProgress(Math.max(0, progress - 10))}
            >
              -10%
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setProgress(Math.min(100, progress + 10))}
            >
              +10%
            </Button>
          </div>
        </div>

        <Divider />

        {/* Different Variants */}
        <div className="space-y-3">
          <ProgressBar value={75} variant="success" label="Success" showLabel />
          <ProgressBar value={50} variant="warning" label="Warning" showLabel />
          <ProgressBar value={30} variant="error" label="Error" showLabel />
          <ProgressBar value={90} variant="gradient" label="Gradient" showLabel />
        </div>

        <Divider />

        {/* Circular Progress */}
        <div className="flex items-center gap-adaptive flex-wrap">
          <CircularProgress value={25} size={80} />
          <CircularProgress value={50} size={80} variant="success" />
          <CircularProgress value={75} size={80} variant="warning" />
          <CircularProgress value={90} size={80} variant="error" />
        </div>

        <Divider />

        {/* Indeterminate */}
        <div>
          <Text variant="body" className="mb-2">
            Indeterminate (Loading)
          </Text>
          <IndeterminateProgress />
        </div>
      </div>
    </Card>
  );
}

function SkeletonExamples() {
  const [loading, setLoading] = useState(true);

  return (
    <Card variant="elevated" padding="lg">
      <div className="flex items-center justify-between mb-adaptive">
        <Text variant="h3">Skeleton Loaders</Text>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setLoading(!loading)}
        >
          {loading ? 'Show Content' : 'Show Loading'}
        </Button>
      </div>

      <div className="space-adaptive-y-lg">
        {loading ? (
          <>
            {/* Text Skeleton */}
            <div>
              <Text variant="caption" color="muted" className="mb-2">
                Text Skeleton
              </Text>
              <SkeletonText lines={3} />
            </div>

            <Divider />

            {/* Card Skeleton */}
            <div>
              <Text variant="caption" color="muted" className="mb-2">
                Card Skeleton
              </Text>
              <SkeletonCard />
            </div>

            <Divider />

            {/* List Skeleton */}
            <div>
              <Text variant="caption" color="muted" className="mb-2">
                List Skeleton
              </Text>
              <SkeletonList items={3} />
            </div>
          </>
        ) : (
          <Card variant="filled" padding="lg">
            <Text variant="h4" className="mb-2">
              Real Content
            </Text>
            <Text variant="body" color="muted">
              This is the actual content that appears after loading is complete.
              The skeleton loaders provide a smooth loading experience.
            </Text>
          </Card>
        )}
      </div>
    </Card>
  );
}

function DatePickerExamples() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  return (
    <Card variant="elevated" padding="lg">
      <Text variant="h3" className="mb-adaptive">
        Date Pickers
      </Text>

      <div className="space-adaptive-y-lg">
        {/* Single Date */}
        <div>
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            label="Select a date"
            placeholder="Choose date..."
          />
          {selectedDate && (
            <Text variant="caption" color="muted" className="mt-2">
              Selected: {selectedDate.toLocaleDateString()}
            </Text>
          )}
        </div>

        <Divider />

        {/* Date Range */}
        <div>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            label="Select date range"
          />
          {startDate && endDate && (
            <Text variant="caption" color="muted" className="mt-2">
              Range: {startDate.toLocaleDateString()} -{' '}
              {endDate.toLocaleDateString()}
            </Text>
          )}
        </div>

        <Divider />

        {/* With Restrictions */}
        <DatePicker
          value={undefined}
          onChange={() => {}}
          label="Future dates only"
          minDate={new Date()}
          placeholder="Select future date..."
        />
      </div>
    </Card>
  );
}

function FileUploadExamples() {
  const [files, setFiles] = useState<File[]>([]);
  const [avatar, setAvatar] = useState<File | undefined>();

  return (
    <Card variant="elevated" padding="lg">
      <Text variant="h3" className="mb-adaptive">
        File Upload
      </Text>

      <div className="space-adaptive-y-lg">
        {/* Multiple Files */}
        <div>
          <FileUpload
            onUpload={(uploadedFiles) => {
              setFiles(uploadedFiles);
              console.log('Uploaded:', uploadedFiles);
            }}
            label="Upload multiple files"
            description="Drag and drop files here or click to browse"
            accept="image/*,.pdf,.doc,.docx"
            multiple
            maxSize={10}
            maxFiles={5}
            showPreview
          />
        </div>

        <Divider />

        {/* Single Image */}
        <div>
          <FileUpload
            onUpload={(uploadedFiles) => {
              console.log('Single file:', uploadedFiles[0]);
            }}
            label="Upload single image"
            accept="image/*"
            multiple={false}
            maxSize={5}
            showPreview
          />
        </div>

        <Divider />

        {/* Avatar Upload */}
        <div>
          <Text variant="body" className="mb-adaptive-sm">
            Avatar Upload
          </Text>
          <AvatarUpload
            onUpload={(file) => {
              setAvatar(file);
              console.log('Avatar:', file);
            }}
            currentImage="https://api.dicebear.com/7.x/avataaars/svg?seed=example"
          />
          {avatar && (
            <Text variant="caption" color="muted" className="mt-2">
              New avatar: {avatar.name}
            </Text>
          )}
        </div>
      </div>
    </Card>
  );
}

export function NewComponentsShowcase() {
  return (
    <ToastProvider position="top-right" maxToasts={3}>
      <div className="min-h-screen bg-background p-adaptive">
        <div className="max-w-6xl mx-auto space-adaptive-y-lg">
          {/* Header */}
          <div className="text-center mb-adaptive-lg">
            <Text variant="h1" weight="bold">
              New Components Showcase 🎉
            </Text>
            <Text variant="body" color="muted">
              6 powerful new components added to the design system
            </Text>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-adaptive-lg">
            <ToastExamples />
            <TooltipExamples />
            <ProgressBarExamples />
            <SkeletonExamples />
            <DatePickerExamples />
            <FileUploadExamples />
          </div>

          {/* Summary */}
          <Card variant="gradient" padding="xl">
            <Text variant="h3" className="mb-adaptive text-white">
              ✅ All 6 Components Ready!
            </Text>
            <div className="grid grid-cols-2 gap-4 text-white">
              <div>
                <Text variant="body" className="text-white/90">
                  ✨ Toast - Notifications
                </Text>
                <Text variant="body" className="text-white/90">
                  💬 Tooltip - Hover info
                </Text>
                <Text variant="body" className="text-white/90">
                  📊 ProgressBar - Loading
                </Text>
              </div>
              <div>
                <Text variant="body" className="text-white/90">
                  👻 Skeleton - Placeholders
                </Text>
                <Text variant="body" className="text-white/90">
                  📅 DatePicker - Date selection
                </Text>
                <Text variant="body" className="text-white/90">
                  📤 FileUpload - File handling
                </Text>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ToastProvider>
  );
}
