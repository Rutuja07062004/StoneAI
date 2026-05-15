import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Dimensions 
} from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Check } from 'lucide-react-native';
import { COLORS, SIZES } from '../../constants/theme';

const { height } = Dimensions.get('window');

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: {
    rarity: string[];
    hardness: string[];
  };
  onUpdateFilters: (key: 'rarity' | 'hardness', value: string) => void;
  onReset: () => void;
}

const RARITY_OPTIONS = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Abundant'];
const HARDNESS_OPTIONS = ['1-3', '4-6', '7-8', '9-10'];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onUpdateFilters,
  onReset
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={onClose} 
          style={styles.dismissArea} 
        />
        <BlurView intensity={40} tint="dark" style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Specimens</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rarity</Text>
              <View style={styles.optionsGrid}>
                {RARITY_OPTIONS.map(option => {
                  const isSelected = filters.rarity.includes(option);
                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() => onUpdateFilters('rarity', option)}
                      style={[styles.option, isSelected && styles.selectedOption]}
                    >
                      <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                        {option}
                      </Text>
                      {isSelected && <Check size={14} color="#000000" />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mohs Hardness</Text>
              <View style={styles.optionsGrid}>
                {HARDNESS_OPTIONS.map(option => {
                  const isSelected = filters.hardness.includes(option);
                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() => onUpdateFilters('hardness', option)}
                      style={[styles.option, isSelected && styles.selectedOption]}
                    >
                      <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                        {option}
                      </Text>
                      {isSelected && <Check size={14} color="#000000" />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={onReset} style={styles.resetBtn}>
              <Text style={styles.resetBtnText}>Reset All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.applyBtn}>
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dismissArea: {
    flex: 1,
  },
  content: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
    maxHeight: height * 0.7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  selectedOptionText: {
    color: '#000000',
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  resetBtn: {
    flex: 1,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  applyBtn: {
    flex: 2,
    height: 52,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  applyBtnText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 16,
  }
});
