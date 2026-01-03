import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Camera, User, Mail, Phone, MapPin, FileText, Users, Star, Save, Upload } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppearance } from '../contexts/AppearanceContext';
import Avatar from '../components/atoms/Avatar';
import Card from '../components/molecules/Card';
import StatsCard from '../components/molecules/StatsCard';
import Timeline from '../components/molecules/Timeline';
import Tabs from '../components/molecules/Tabs';
import AvatarGroup from '../components/molecules/AvatarGroup';
import Rating from '../components/atoms/Rating';
import Button from '../components/atoms/Button';
import Divider from '../components/atoms/Divider';
import { Modal } from '../components/molecules/Modal';
import { useToast, ToastContainer } from '../components/molecules/Toast';
import { TextArea } from '../components/atoms/TextArea';
import { Select } from '../components/atoms/Select';
import { DatePicker } from '../components/molecules/DatePicker';
import { ProgressBar } from '../components/atoms/ProgressBar';
import { Spinner } from '../components/atoms/Spinner';
import { spacing, borderRadius } from '../theme/tokens';

/**
 * Profile Screen - React Native
 * 
 * Complete redesign with stats, timeline, tabs, and connections
 * Enhanced with Phase 6-7 components
 */

const ProfileScreen: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const { theme } = useAppearance();
  const { toasts, success, error } = useToast();
  
  const [activeTab, setActiveTab] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [birthDate, setBirthDate] = useState<Date | undefined>(user?.birthDate);
  const [country, setCountry] = useState(user?.country || 'us');
  const [language, setLanguageValue] = useState(user?.language || 'en');

  const countries = [
    { value: 'us', label: 'United States' },
    { value: 'vn', label: 'Vietnam' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'vi', label: 'Tiếng Việt' },
  ];

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    updateUser({ 
      name, 
      email, 
      phone, 
      bio, 
      location,
      birthDate,
      country,
      language 
    });
    
    setSaving(false);
    setIsEditing(false);
    success('Profile updated successfully!', 'Success');
  };

  const simulateUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setShowAvatarModal(false);
          success('Avatar uploaded successfully!', 'Success');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleAvatarChange = () => {
    setShowAvatarModal(true);
  };

  const profileStats = [
    {
      id: 1,
      title: 'Posts',
      value: '45',
      change: '+12',
      trend: 'up' as const,
      icon: <FileText size={20} color="#3B82F6" />,
    },
    {
      id: 2,
      title: 'Followers',
      value: '1.2K',
      change: '+234',
      trend: 'up' as const,
      icon: <Users size={20} color="#10B981" />,
    },
    {
      id: 3,
      title: 'Following',
      value: '892',
      change: '+45',
      trend: 'up' as const,
      icon: <Users size={20} color="#8B5CF6" />,
    },
    {
      id: 4,
      title: 'Rating',
      value: '4.8',
      change: '+0.2',
      trend: 'up' as const,
      icon: <Star size={20} color="#F59E0B" />,
    },
  ];

  const recentActivity = [
    {
      id: '1',
      title: 'Published new article',
      description: 'How to build React Native apps',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      icon: '📝',
      status: 'completed' as const,
    },
    {
      id: '2',
      title: 'Achieved milestone',
      description: '1000 followers reached',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      icon: '🎉',
      status: 'completed' as const,
    },
    {
      id: '3',
      title: 'Updated profile',
      description: 'Added new skills and bio',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      icon: '✏️',
      status: 'completed' as const,
    },
    {
      id: '4',
      title: 'Joined community',
      description: 'React Native Developers',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      icon: '👥',
      status: 'completed' as const,
    },
  ];

  const connections = [
    {
      id: '1',
      name: 'Alice Johnson',
      imageUrl: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: '2',
      name: 'Bob Smith',
      imageUrl: 'https://i.pravatar.cc/150?img=6',
    },
    {
      id: '3',
      name: 'Carol White',
      imageUrl: 'https://i.pravatar.cc/150?img=7',
    },
    {
      id: '4',
      name: 'David Brown',
      imageUrl: 'https://i.pravatar.cc/150?img=8',
    },
    {
      id: '5',
      name: 'Eve Davis',
      imageUrl: 'https://i.pravatar.cc/150?img=9',
    },
  ];

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'activity', label: 'Activity' },
    { id: 'connections', label: 'Connections' },
  ];

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.primary,
      borderBottomLeftRadius: borderRadius['3xl'],
      borderBottomRightRadius: borderRadius['3xl'],
      padding: spacing.xl,
      paddingBottom: spacing.lg,
    },
    avatarContainer: {
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    avatarWrapper: {
      position: 'relative',
    },
    cameraButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: theme.colors.primary,
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    userName: {
      fontSize: 24,
      fontWeight: '700',
      color: '#FFFFFF',
      marginTop: spacing.sm,
      textAlign: 'center',
    },
    userEmail: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center',
      marginTop: spacing.xs,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      marginTop: spacing.sm,
    },
    ratingValue: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    content: {
      padding: spacing.lg,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: spacing.md,
    },
    statsGrid: {
      gap: spacing.md,
    },
    aboutCard: {
      gap: spacing.md,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
    },
    infoLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: spacing.xs,
    },
    infoValue: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    connectionsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    viewAllText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '500',
    },
  });

  const renderAbout = () => (
    <View style={styles.section}>
      <Card variant="default" padding="lg">
        <View style={styles.aboutCard}>
          <View>
            <Text style={styles.infoLabel}>Bio</Text>
            <Text style={styles.infoValue}>
              Passionate developer building amazing mobile experiences with React Native.
              Love learning new technologies and sharing knowledge with the community.
            </Text>
          </View>

          <Divider />

          <View style={styles.infoRow}>
            <Mail size={20} color={theme.colors.textSecondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Phone size={20} color={theme.colors.textSecondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user?.phone || 'Not set'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MapPin size={20} color={theme.colors.textSecondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>San Francisco, CA</Text>
            </View>
          </View>

          <Divider />

          <Button onPress={handleEditProfile} variant="secondary" fullWidth>
            Edit Profile
          </Button>
        </View>
      </Card>
    </View>
  );

  const renderActivity = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <Timeline items={recentActivity} />
    </View>
  );

  const renderConnections = () => (
    <View style={styles.section}>
      <View style={styles.connectionsHeader}>
        <Text style={styles.sectionTitle}>Connections</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <AvatarGroup avatars={connections} max={8} size="lg" />
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return renderAbout();
      case 'activity':
        return renderActivity();
      case 'connections':
        return renderConnections();
      default:
        return renderAbout();
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Avatar */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Avatar
              src={user?.avatar}
              name={user?.name}
              size="xl"
            />
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handleAvatarChange}
            >
              <Camera size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.ratingContainer}>
            <Rating value={4.8} size="md" readonly />
            <Text style={styles.ratingValue}>4.8</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Profile Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Stats</Text>
          <View style={styles.statsGrid}>
            {profileStats.map((stat) => (
              <StatsCard
                key={stat.id}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                trend={stat.trend}
                icon={stat.icon}
              />
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.section}>
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Profile"
        footer={
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button
              onPress={() => setIsEditing(false)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onPress={handleSave}
              variant="primary"
              disabled={saving}
            >
              {saving ? <Spinner size={16} color="#FFFFFF" /> : 'Save'}
            </Button>
          </View>
        }
      >
        <View style={{ gap: spacing.md }}>
          <View style={styles.infoRow}>
            <User size={20} color={theme.colors.textSecondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Name</Text>
              <TextArea
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                style={{ height: 40 }}
              />
            </View>
          </View>

          <View style={styles.infoRow}>
            <Mail size={20} color={theme.colors.textSecondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Email</Text>
              <TextArea
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                style={{ height: 40 }}
              />
            </View>
          </View>

          <View style={styles.infoRow}>
            <Phone size={20} color={theme.colors.textSecondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Phone</Text>
              <TextArea
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                style={{ height: 40 }}
              />
            </View>
          </View>

          <View style={styles.infoRow}>
            <MapPin size={20} color={theme.colors.textSecondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Location</Text>
              <TextArea
                value={location}
                onChangeText={setLocation}
                placeholder="Enter your location"
                style={{ height: 40 }}
              />
            </View>
          </View>

          <View style={styles.infoRow}>
            <FileText size={20} color={theme.colors.textSecondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Bio</Text>
              <TextArea
                value={bio}
                onChangeText={setBio}
                placeholder="Enter your bio"
                style={{ height: 80 }}
              />
            </View>
          </View>

          <View style={styles.infoRow}>
            <DatePicker
              value={birthDate}
              onChange={setBirthDate}
              label="Birth Date"
            />
          </View>

          <View style={styles.infoRow}>
            <Select
              value={country}
              onChange={setCountry}
              label="Country"
              options={countries}
            />
          </View>

          <View style={styles.infoRow}>
            <Select
              value={language}
              onChange={setLanguageValue}
              label="Language"
              options={languages}
            />
          </View>
        </View>
      </Modal>

      {/* Avatar Upload Modal */}
      <Modal
        visible={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        title="Upload Avatar"
        footer={
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button
              onPress={() => setShowAvatarModal(false)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onPress={simulateUpload}
              variant="primary"
              disabled={uploading}
            >
              {uploading ? <Spinner size={16} color="#FFFFFF" /> : 'Upload'}
            </Button>
          </View>
        }
      >
        <View style={{ gap: spacing.md }}>
          <Text style={styles.infoLabel}>Upload a new avatar</Text>
          <ProgressBar value={uploadProgress} />
        </View>
      </Modal>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </ScrollView>
  );
};

export default ProfileScreen;