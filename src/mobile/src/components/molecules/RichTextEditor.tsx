import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Bold, Italic, List, Link as LinkIcon } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  showToolbar?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Start typing...',
  minHeight = 200,
  maxHeight = 500,
  showToolbar = true,
}) => {
  const { theme } = useAppearance();
  const [content, setContent] = useState(value);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const handleChange = (text: string) => {
    setContent(text);
    if (onChange) {
      onChange(text);
    }
  };

  const insertText = (before: string, after: string = '') => {
    const { start, end } = selection;
    const newText =
      content.substring(0, start) +
      before +
      content.substring(start, end) +
      after +
      content.substring(end);
    
    handleChange(newText);
  };

  const applyBold = () => insertText('**', '**');
  const applyItalic = () => insertText('_', '_');
  const applyList = () => insertText('\n- ');
  const applyLink = () => insertText('[', '](url)');

  const styles = StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: theme.colors.card,
    },
    toolbar: {
      flexDirection: 'row',
      padding: 8,
      gap: 4,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    toolButton: {
      padding: 8,
      borderRadius: 6,
      backgroundColor: 'transparent',
    },
    toolButtonActive: {
      backgroundColor: theme.colors.primary + '20',
    },
    divider: {
      width: 1,
      backgroundColor: theme.colors.border,
      marginHorizontal: 4,
    },
    editor: {
      padding: 16,
      fontSize: 15,
      color: theme.colors.text,
      textAlignVertical: 'top',
    },
    footer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    footerText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      {/* Toolbar */}
      {showToolbar && (
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={applyBold} style={styles.toolButton} activeOpacity={0.7}>
            <Bold size={18} color={theme.colors.text} />
          </TouchableOpacity>

          <TouchableOpacity onPress={applyItalic} style={styles.toolButton} activeOpacity={0.7}>
            <Italic size={18} color={theme.colors.text} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={applyList} style={styles.toolButton} activeOpacity={0.7}>
            <List size={18} color={theme.colors.text} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={applyLink} style={styles.toolButton} activeOpacity={0.7}>
            <LinkIcon size={18} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      )}

      {/* Editor */}
      <TextInput
        value={content}
        onChangeText={handleChange}
        onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        multiline
        style={[
          styles.editor,
          {
            minHeight,
            maxHeight,
          },
        ]}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>{content.length} characters</Text>
      </View>
    </View>
  );
};
