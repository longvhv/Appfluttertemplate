import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Home,
  FolderOpen,
  FileText,
  Users,
  Settings,
  Save,
  Copy,
  Trash2,
  Bold,
  Italic,
  Download,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Activity,
  Plus,
} from 'lucide-react';
import { Breadcrumbs } from '../components/molecules/Breadcrumbs';
import { Tabs } from '../components/molecules/Tabs';
import { Stepper } from '../components/organisms/Stepper';
import { CommandPalette } from '../components/organisms/CommandPalette';
import { StatCard } from '../components/molecules/StatCard';
import { EmptyState } from '../components/molecules/EmptyState';
import { FileUpload } from '../components/molecules/FileUpload';
import { RichTextEditor } from '../components/molecules/RichTextEditor';
import { ProgressIndicator } from '../components/molecules/ProgressIndicator';
import { Skeleton, SkeletonCard, SkeletonList } from '../components/molecules/Skeleton';
import { Tour } from '../components/organisms/Tour';
import { ColorPicker } from '../components/molecules/ColorPicker';
import { TreeView } from '../components/organisms/TreeView';
import { Toolbar } from '../components/molecules/Toolbar';
import { SplitPanel } from '../components/organisms/SplitPanel';
import { Button } from '../components/atoms/Button';
import { Card } from '../components/molecules/Card';
import { useToast } from '../src/components/Toast';

export function AdvancedComponentsShowcase() {
  const [activeDemo, setActiveDemo] = useState<string>('breadcrumbs');
  const [showTour, setShowTour] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const { success, info } = useToast();

  const demos = [
    { id: 'breadcrumbs', label: 'Breadcrumbs' },
    { id: 'tabs', label: 'Tabs' },
    { id: 'stepper', label: 'Stepper' },
    { id: 'command', label: 'Command Palette' },
    { id: 'stats', label: 'Stat Cards' },
    { id: 'empty', label: 'Empty States' },
    { id: 'upload', label: 'File Upload' },
    { id: 'editor', label: 'Rich Text Editor' },
    { id: 'progress', label: 'Progress' },
    { id: 'skeleton', label: 'Skeleton' },
    { id: 'tour', label: 'Tour' },
    { id: 'color', label: 'Color Picker' },
    { id: 'tree', label: 'Tree View' },
    { id: 'toolbar', label: 'Toolbar' },
    { id: 'split', label: 'Split Panel' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Advanced Components Showcase
          </h1>
          <div className="flex gap-2 flex-wrap">
            {demos.map((demo) => (
              <Button
                key={demo.id}
                variant={activeDemo === demo.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveDemo(demo.id)}
              >
                {demo.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {activeDemo === 'breadcrumbs' && (
            <DemoBreadcrumbs onAction={info} />
          )}
          {activeDemo === 'tabs' && (
            <DemoTabs />
          )}
          {activeDemo === 'stepper' && (
            <DemoStepper onComplete={() => success('Form completed!')} />
          )}
          {activeDemo === 'command' && (
            <DemoCommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
          )}
          {activeDemo === 'stats' && (
            <DemoStatCards />
          )}
          {activeDemo === 'empty' && (
            <DemoEmptyStates />
          )}
          {activeDemo === 'upload' && (
            <DemoFileUpload onUpload={() => success('Files uploaded!')} />
          )}
          {activeDemo === 'editor' && (
            <DemoRichTextEditor />
          )}
          {activeDemo === 'progress' && (
            <DemoProgress />
          )}
          {activeDemo === 'skeleton' && (
            <DemoSkeleton />
          )}
          {activeDemo === 'tour' && (
            <DemoTour showTour={showTour} setShowTour={setShowTour} />
          )}
          {activeDemo === 'color' && (
            <DemoColorPicker onChange={(color) => info(`Selected: ${color}`)} />
          )}
          {activeDemo === 'tree' && (
            <DemoTreeView onSelect={(node) => info(`Selected: ${node.label}`)} />
          )}
          {activeDemo === 'toolbar' && (
            <DemoToolbar />
          )}
          {activeDemo === 'split' && (
            <DemoSplitPanel />
          )}
        </div>
      </div>

      <Tour
        steps={[
          { target: '#demo-section', title: 'Welcome!', content: 'This is the showcase' },
        ]}
        run={showTour}
        onComplete={() => setShowTour(false)}
      />
    </div>
  );
}

// Individual Demo Components
const DemoBreadcrumbs: React.FC<{ onAction: (msg: string) => void }> = ({ onAction }) => (
  <div className="space-y-8">
    <Card>
      <h3 className="text-lg font-semibold mb-4">Default Breadcrumbs</h3>
      <Breadcrumbs
        items={[
          { id: '1', label: 'Home', onClick: () => onAction('Home') },
          { id: '2', label: 'Documents', onClick: () => onAction('Documents') },
          { id: '3', label: 'Projects', onClick: () => onAction('Projects') },
          { id: '4', label: 'Current File' },
        ]}
      />
    </Card>

    <Card>
      <h3 className="text-lg font-semibold mb-4">With Icons</h3>
      <Breadcrumbs
        items={[
          { id: '1', label: 'Home', icon: Home },
          { id: '2', label: 'Folders', icon: FolderOpen },
          { id: '3', label: 'Current' },
        ]}
        separator="slash"
      />
    </Card>
  </div>
);

const DemoTabs: React.FC = () => (
  <Card>
    <Tabs
      items={[
        {
          id: 'overview',
          label: 'Overview',
          icon: Home,
          content: <div className="p-4">Overview content here</div>,
        },
        {
          id: 'users',
          label: 'Users',
          icon: Users,
          badge: 12,
          content: <div className="p-4">Users list here</div>,
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: Settings,
          content: <div className="p-4">Settings panel here</div>,
        },
      ]}
      variant="underline"
    />
  </Card>
);

const DemoStepper: React.FC<{ onComplete: () => void }> = ({ onComplete }) => (
  <Card>
    <Stepper
      steps={[
        {
          id: '1',
          label: 'Account Info',
          content: <div className="p-8 text-center">Step 1: Enter your account information</div>,
        },
        {
          id: '2',
          label: 'Preferences',
          content: <div className="p-8 text-center">Step 2: Set your preferences</div>,
        },
        {
          id: '3',
          label: 'Review',
          content: <div className="p-8 text-center">Step 3: Review and confirm</div>,
        },
      ]}
      onComplete={onComplete}
    />
  </Card>
);

const DemoCommandPalette: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void }> = ({
  open,
  onOpenChange,
}) => (
  <div>
    <Card className="p-12 text-center">
      <h3 className="text-xl font-semibold mb-4">Press ⌘K or click button</h3>
      <Button onClick={() => onOpenChange(true)}>
        Open Command Palette
      </Button>
    </Card>

    <CommandPalette
      open={open}
      onOpenChange={onOpenChange}
      items={[
        { id: '1', label: 'New Document', icon: FileText, category: 'Actions', onSelect: () => {} },
        { id: '2', label: 'Open Settings', icon: Settings, category: 'Actions', onSelect: () => {} },
        { id: '3', label: 'View Users', icon: Users, category: 'Navigation', onSelect: () => {} },
      ]}
    />
  </div>
);

const DemoStatCards: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard
      title="Total Revenue"
      value="$54,239"
      icon={DollarSign}
      trend={{ value: 12.5, label: 'vs last month' }}
    />
    <StatCard
      title="New Orders"
      value="1,429"
      icon={ShoppingCart}
      trend={{ value: 8.2, label: 'vs last week' }}
      variant="gradient"
    />
    <StatCard
      title="Active Users"
      value="8,234"
      icon={Users}
      trend={{ value: -2.4, label: 'vs yesterday', isPositive: false }}
    />
    <StatCard
      title="Conversion Rate"
      value="3.2%"
      icon={Activity}
      trend={{ value: 1.8, label: 'vs last month' }}
      variant="minimal"
    />
  </div>
);

const DemoEmptyStates: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <Card>
      <EmptyState
        title="No items found"
        description="Get started by creating your first item"
        action={{
          label: 'Create Item',
          onClick: () => {},
        }}
      />
    </Card>

    <Card>
      <EmptyState
        title="No search results"
        description="Try adjusting your search query"
        variant="search"
        secondaryAction={{
          label: 'Clear Filters',
          onClick: () => {},
        }}
      />
    </Card>
  </div>
);

const DemoFileUpload: React.FC<{ onUpload: () => void }> = ({ onUpload }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <Card>
      <h3 className="text-lg font-semibold mb-4">Default Upload</h3>
      <FileUpload
        accept="image/*"
        multiple
        maxSize={5}
        onUpload={() => onUpload()}
      />
    </Card>

    <Card>
      <h3 className="text-lg font-semibold mb-4">Compact Upload</h3>
      <FileUpload
        variant="compact"
        accept=".pdf,.docx"
      />
    </Card>
  </div>
);

const DemoRichTextEditor: React.FC = () => {
  const [content, setContent] = useState('');

  return (
    <Card>
      <RichTextEditor
        value={content}
        onChange={setContent}
        placeholder="Start typing..."
      />
    </Card>
  );
};

const DemoProgress: React.FC = () => (
  <div className="space-y-8">
    <Card>
      <h3 className="text-lg font-semibold mb-4">Linear Progress</h3>
      <div className="space-y-4">
        <ProgressIndicator value={45} label="Uploading..." />
        <ProgressIndicator value={75} status="success" label="Processing" />
        <ProgressIndicator value={30} status="error" label="Failed" />
      </div>
    </Card>

    <Card>
      <h3 className="text-lg font-semibold mb-4">Circular Progress</h3>
      <div className="flex gap-8">
        <ProgressIndicator value={65} variant="circular" />
        <ProgressIndicator value={100} variant="circular" status="success" />
        <ProgressIndicator value={45} variant="circular" indeterminate />
      </div>
    </Card>

    <Card>
      <h3 className="text-lg font-semibold mb-4">Steps Progress</h3>
      <ProgressIndicator value={50} variant="steps" steps={4} label="Onboarding" />
    </Card>
  </div>
);

const DemoSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <SkeletonCard />
    <SkeletonList items={3} />
  </div>
);

const DemoTour: React.FC<{ showTour: boolean; setShowTour: (show: boolean) => void }> = ({
  showTour,
  setShowTour,
}) => (
  <Card className="p-12 text-center">
    <h3 className="text-xl font-semibold mb-4">Product Tour</h3>
    <Button onClick={() => setShowTour(true)}>
      Start Tour
    </Button>
  </Card>
);

const DemoColorPicker: React.FC<{ onChange: (color: string) => void }> = ({ onChange }) => (
  <Card>
    <h3 className="text-lg font-semibold mb-4">Color Picker</h3>
    <ColorPicker onChange={onChange} />
  </Card>
);

const DemoTreeView: React.FC<{ onSelect: (node: any) => void }> = ({ onSelect }) => (
  <Card>
    <TreeView
      data={[
        {
          id: '1',
          label: 'Documents',
          children: [
            { id: '1-1', label: 'Work', children: [{ id: '1-1-1', label: 'Project.pdf' }] },
            { id: '1-2', label: 'Personal' },
          ],
        },
        { id: '2', label: 'Images' },
      ]}
      onSelect={onSelect}
    />
  </Card>
);

const DemoToolbar: React.FC = () => (
  <Card>
    <Toolbar
      items={[
        { id: 'save', label: 'Save', icon: Save },
        { id: 'copy', label: 'Copy', icon: Copy },
        { id: 'divider', type: 'divider' },
        { id: 'delete', label: 'Delete', icon: Trash2, variant: 'danger' },
      ]}
    />
  </Card>
);

const DemoSplitPanel: React.FC = () => (
  <Card className="h-96">
    <SplitPanel
      leftPanel={
        <div className="p-4 bg-gray-50 dark:bg-gray-900 h-full">
          <h4 className="font-semibold mb-2">Left Panel</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Content here</p>
        </div>
      }
      rightPanel={
        <div className="p-4 h-full">
          <h4 className="font-semibold mb-2">Right Panel</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Content here</p>
        </div>
      }
    />
  </Card>
);
