// components/AnimatedBanner.tsx
import * as Animatable from 'react-native-animatable';
import { View, Text, StyleSheet } from 'react-native';

export default function AnimatedBanner() {
    const now = new Date();
    const currentHour = now.getHours();

    const isAfter1PM = currentHour >= 13;

    return (
        <View style={styles.container}>
            <Animatable.View animation="slideInDown" style={[styles.banner, styles.green]}>
                <Text style={styles.text}>🍃 Exotic paans available all day</Text>
            </Animatable.View>

            <Animatable.View animation="slideInDown" delay={800} style={[styles.banner, styles.red]}>
                <Text style={styles.text}>
                    🌶️ {isAfter1PM ? 'Chaats available now' : 'Chaats available after 1 PM'}
                </Text>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    banner: {
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    green: {
        backgroundColor: '#D0F8CE',
    },
    red: {
        backgroundColor: '#FFE0E0',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});
