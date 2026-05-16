// CommonLayout.jsx
// Location: src/components/CommonLayout.jsx

import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../styles/colors";

/**
 * Universelles Layout mit ScrollView, das in allen Seiten verwendet werden kann.
 */
export function ScreenLayout({ children, contentStyle, ...props }) {
    return (
        <ScrollView 
            style={styles.page} 
            contentContainerStyle={[styles.content, contentStyle]} 
            showsVerticalScrollIndicator={false}
            {...props}
        >
            {children}
        </ScrollView>
    );
}

/**
 * Universelle Zurück-Schaltfläche mit Icon, die in allen Seiten verwendet werden kann.
 */
export function BackButton({ onPress, title = "Zurück" }) {
    return (
        <TouchableOpacity style={styles.backLink} onPress={onPress} activeOpacity={0.7}>
            <MaterialCommunityIcons
                name="chevron-left"
                size={24}
                color={COLORS.primary}
            />
            <Text style={styles.backLinkText}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: 24,
        paddingBottom: 80,
    },
    backLink: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        marginLeft: -5,
    },
    backLinkText: {
        color: COLORS.primary,
        fontWeight: "600",
        fontSize: 16,
    },
});