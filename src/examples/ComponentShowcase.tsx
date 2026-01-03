/**
 * COMPONENT SHOWCASE
 * 
 * This file demonstrates ALL components in the design system.
 * Use this as a reference for implementation.
 */

import React, { useState } from 'react';
import { Mail, Bell, Check, Settings, User, Heart } from 'lucide-react';
import {
  // Atoms
  Button,
  Input,
  Text,
  Badge,
  Avatar,
  Switch,
  Checkbox,
  Radio,
  IconButton,
  Spinner,
  Divider,
  // Molecules
  Card,
  ListItem,
  SearchBar,
  FormField,
  Select,
  RadioGroup,
  Tabs,
  TabPanel,
  Accordion,
  // Organisms
  Modal,
  ModalFooter,
  // Hooks
  useForm,
} from '../components/ui';

export function ComponentShowcase() {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('atoms');

  return (
    <div className="min-h-screen bg-background p-adaptive">
      <div className="max-w-6xl mx-auto space-adaptive-y-lg">
        {/* Header */}
        <div className="text-center mb-adaptive-lg">
          <Text variant="h1" weight="bold">Design System Showcase</Text>
          <Text variant="body" color="muted">
            Complete library of reusable components
          </Text>
        </div>

        {/* Navigation */}
        <Tabs
          tabs={[
            { id: 'atoms', label: 'Atoms', badge: 11 },
            { id: 'molecules', label: 'Molecules', badge: 8 },
            { id: 'organisms', label: 'Organisms', badge: 1 },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="underline"
          fullWidth
        />

        {/* ATOMS */}
        <TabPanel activeTab={activeTab} tabId="atoms">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-adaptive-lg">
            {/* Buttons */}
            <Card variant="elevated" padding="lg">
              <Text variant="h3" className="mb-adaptive">Buttons</Text>
              <div className="space-adaptive-y-sm">
                <Button variant="primary" fullWidth>Primary Button</Button>
                <Button variant="secondary" fullWidth>Secondary Button</Button>
                <Button variant="outline" fullWidth>Outline Button</Button>
                <Button variant="ghost" fullWidth>Ghost Button</Button>
                <Button variant="danger" fullWidth>Danger Button</Button>
                <Button variant="gradient" fullWidth icon={Mail}>Gradient Button</Button>
                <Button variant="primary" loading fullWidth>Loading...</Button>
                <Button variant="primary" disabled fullWidth>Disabled</Button>
              </div>
            </Card>

            {/* Icon Buttons */}
            <Card variant="elevated" padding="lg">
              <Text variant="h3" className="mb-adaptive">Icon Buttons</Text>
              <div className="flex gap-adaptive flex-wrap">
                <IconButton icon={Mail} variant="primary" size="sm" />
                <IconButton icon={Bell} variant="secondary" size="md" />
                <IconButton icon={Heart} variant="danger" size="lg" />
                <IconButton icon={Settings} variant="ghost" size="xl" />
                <IconButton icon={Check} variant="primary" loading size="md" />
              </div>
            </Card>

            {/* Inputs */}
            <Card variant="elevated" padding="lg">
              <Text variant="h3" className="mb-adaptive">Inputs</Text>
              <div className="space-adaptive-y">
                <Input
                  value=""
                  onChange={() => {}}
                  placeholder="Default input"
                />
                <Input
                  value=""
                  onChange={() => {}}
                  label="Email"
                  type="email"
                  leftIcon={Mail}
                  placeholder="you@example.com"
                />
                <Input
                  value=""
                  onChange={() => {}}
                  label="With error"
                  error="This field is required"
                />
              </div>
            </Card>

            {/* Badges */}
            <Card variant="elevated" padding="lg">
              <Text variant="h3" className="mb-adaptive">Badges</Text>
              <div className="flex flex-wrap gap-adaptive-sm">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success" dot>Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info" size="lg">Info Large</Badge>
              </div>
            </Card>

            {/* Avatars */}
            <Card variant="elevated" padding="lg">
              <Text variant="h3" className="mb-adaptive">Avatars</Text>
              <div className="flex items-center gap-adaptive">
                <Avatar size="xs" name="John Doe" />
                <Avatar size="sm" name="Jane Smith" />
                <Avatar size="md" name="Bob Wilson" />
                <Avatar size="lg" name="Alice Brown" />
                <Avatar 
                  size="xl" 
                  name="Charlie Davis"
                  badge={<Badge variant="success" dot />}
                />
              </div>
            </Card>

            {/* Switches */}
            <Card variant="elevated" padding="lg">
              <Text variant="h3" className="mb-adaptive">Switches</Text>
              <div className="space-adaptive-y">
                <Switch 
                  checked={true} 
                  onChange={() => {}}
                  label="Enable notifications"
                  description="Receive push notifications"
                />
                <Switch 
                  checked={false} 
                  onChange={() => {}}
                  label="Dark mode"
                />
                <Switch 
                  checked={true} 
                  onChange={() => {}}
                  size="lg"
                />
              </div>
            </Card>

            {/* Checkboxes */}
            <Card variant="elevated" padding="lg">
              <Text variant="h3" className="mb-adaptive">Checkboxes</Text>
              <div className="space-adaptive-y">
                <Checkbox 
                  checked={true} 
                  onChange={() => {}}
                  label="I agree to terms"
                />
                <Checkbox 
                  checked={false} 
                  onChange={() => {}}
                  label="Subscribe to newsletter"
                  description="Get weekly updates"
                />
                <Checkbox 
                  checked={false} 
                  onChange={() => {}}
                  disabled
                  label="Disabled checkbox"
                />
              </div>
            </Card>

            {/* Radios */}
            <Card variant="elevated" padding="lg">
              <Text variant="h3" className="mb-adaptive">Radio Buttons</Text>
              <div className="space-adaptive-y">
                <Radio 
                  checked={true} 
                  onChange={() => {}}
                  label="Option 1"
                  name="radio-demo"
                />
                <Radio 
                  checked={false} 
                  onChange={() => {}}
                  label="Option 2"
                  description="With description"
                  name="radio-demo"
                />
              </div>
            </Card>

            {/* Spinners */}
            <Card variant="elevated" padding="lg">
              <Text variant="h3" className="mb-adaptive">Spinners</Text>
              <div className="flex items-center gap-adaptive">
                <Spinner size="xs" />
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
                <Spinner size="xl" color="primary" />
              </div>
            </Card>

            {/* Dividers */}
            <Card variant="elevated" padding="lg">
              <Text variant="h3" className="mb-adaptive">Dividers</Text>
              <div className="space-adaptive-y">
                <Divider />
                <Divider label="OR" />
                <Divider label="Continue with" />
              </div>
            </Card>

            {/* Typography */}
            <Card variant="elevated" padding="lg">
              <Text variant="h3" className="mb-adaptive">Typography</Text>
              <div className="space-adaptive-y-sm">
                <Text variant="h1">Heading 1</Text>
                <Text variant="h2">Heading 2</Text>
                <Text variant="h3">Heading 3</Text>
                <Text variant="h4">Heading 4</Text>
                <Text variant="body">Body text</Text>
                <Text variant="caption" color="muted">Caption text</Text>
                <Text variant="body" color="primary">Primary color</Text>
                <Text variant="body" color="error">Error color</Text>
                <Text variant="body" color="success">Success color</Text>
              </div>
            </Card>
          </div>
        </TabPanel>

        {/* MOLECULES */}
        <TabPanel activeTab={activeTab} tabId="molecules">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-adaptive-lg">
            {/* Cards */}
            <Card variant="default" padding="lg">
              <Text variant="h3" className="mb-adaptive">Card Variants</Text>
              <div className="space-adaptive-y">
                <Card variant="default" padding="md">
                  <Text>Default Card</Text>
                </Card>
                <Card variant="elevated" padding="md">
                  <Text>Elevated Card</Text>
                </Card>
                <Card variant="outlined" padding="md">
                  <Text>Outlined Card</Text>
                </Card>
                <Card variant="filled" padding="md">
                  <Text>Filled Card</Text>
                </Card>
              </div>
            </Card>

            {/* List Items */}
            <Card variant="elevated" padding="none">
              <div className="p-adaptive">
                <Text variant="h3">List Items</Text>
              </div>
              <Divider />
              <ListItem
                title="Profile Settings"
                subtitle="Manage your account"
                leftIcon={User}
                showChevron
                onPress={() => console.log('Pressed')}
              />
              <Divider />
              <ListItem
                title="Notifications"
                subtitle="3 new messages"
                leftIcon={Bell}
                rightElement={<Badge variant="error">3</Badge>}
                onPress={() => console.log('Pressed')}
              />
              <Divider />
              <ListItem
                title="Settings"
                leftIcon={Settings}
                showChevron
              />
            </Card>

            {/* Select */}
            <Card variant="elevated" padding="lg">
              <Text variant="h3" className="mb-adaptive">Select Dropdown</Text>
              <Select
                value="option1"
                onChange={() => {}}
                label="Choose an option"
                options={[
                  { value: 'option1', label: 'Option 1' },
                  { value: 'option2', label: 'Option 2' },
                  { value: 'option3', label: 'Option 3' },
                  { value: 'option4', label: 'Disabled Option', disabled: true },
                ]}
              />
            </Card>

            {/* Radio Group */}
            <Card variant="elevated" padding="lg">
              <Text variant="h3" className="mb-adaptive">Radio Group</Text>
              <RadioGroup
                value="option1"
                onChange={() => {}}
                name="demo-radio-group"
                label="Select one"
                options={[
                  { value: 'option1', label: 'First Option' },
                  { value: 'option2', label: 'Second Option', description: 'With description' },
                  { value: 'option3', label: 'Third Option' },
                ]}
              />
            </Card>

            {/* Search Bar */}
            <Card variant="elevated" padding="lg">
              <Text variant="h3" className="mb-adaptive">Search Bar</Text>
              <SearchBar
                value=""
                onChange={() => {}}
                placeholder="Search anything..."
              />
            </Card>

            {/* Tabs Variants */}
            <Card variant="elevated" padding="lg">
              <Text variant="h3" className="mb-adaptive">Tab Variants</Text>
              <div className="space-adaptive-y-lg">
                <div>
                  <Text variant="caption" color="muted" className="mb-2 block">Pills</Text>
                  <Tabs
                    tabs={[
                      { id: 'tab1', label: 'Tab 1' },
                      { id: 'tab2', label: 'Tab 2' },
                      { id: 'tab3', label: 'Tab 3' },
                    ]}
                    activeTab="tab1"
                    onChange={() => {}}
                    variant="pills"
                  />
                </div>
                <div>
                  <Text variant="caption" color="muted" className="mb-2 block">Underline</Text>
                  <Tabs
                    tabs={[
                      { id: 'tab1', label: 'Tab 1', icon: User },
                      { id: 'tab2', label: 'Tab 2', badge: 5 },
                      { id: 'tab3', label: 'Tab 3' },
                    ]}
                    activeTab="tab1"
                    onChange={() => {}}
                    variant="underline"
                  />
                </div>
              </div>
            </Card>

            {/* Accordion */}
            <Card variant="elevated" padding="lg">
              <Text variant="h3" className="mb-adaptive">Accordion</Text>
              <Accordion
                items={[
                  {
                    id: '1',
                    title: 'What is this?',
                    content: 'This is an accordion component with smooth animations.',
                  },
                  {
                    id: '2',
                    title: 'How does it work?',
                    content: 'Click on any item to expand/collapse the content.',
                  },
                  {
                    id: '3',
                    title: 'Can I expand multiple?',
                    content: 'Yes! Set allowMultiple={true} to enable this behavior.',
                  },
                ]}
                allowMultiple
              />
            </Card>
          </div>
        </TabPanel>

        {/* ORGANISMS */}
        <TabPanel activeTab={activeTab} tabId="organisms">
          <Card variant="elevated" padding="lg">
            <Text variant="h3" className="mb-adaptive">Modal</Text>
            <Button onClick={() => setShowModal(true)} variant="primary">
              Open Modal
            </Button>

            <Modal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              title="Example Modal"
              size="md"
              footer={
                <ModalFooter>
                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={() => setShowModal(false)}>
                    Confirm
                  </Button>
                </ModalFooter>
              }
            >
              <Text variant="body" color="muted">
                This is a modal dialog with a title, content, and footer actions.
                It can be positioned at center or bottom, and supports multiple sizes.
              </Text>
            </Modal>
          </Card>
        </TabPanel>
      </div>
    </div>
  );
}
