// common/Accordion.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles/globalStyles';

const Accordion = ({ title, children, isOpen = false, onToggle }) => {
  const [expanded, setExpanded] = useState(isOpen);

  const toggleAccordion = () => {
    setExpanded(!expanded);
    if (onToggle) {
      onToggle(!expanded);
    }
  };

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity onPress={toggleAccordion} style={styles.accordionHeader}>
        <Text style={styles.accordionTitle}>{title}</Text>
        <Icon 
          name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
          size={24} 
          color={colors.dark}
        />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.accordionContent}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  accordionContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
  },
  accordionContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default Accordion;