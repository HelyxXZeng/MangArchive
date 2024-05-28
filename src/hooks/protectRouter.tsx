// chưa có xong, để tính sau, cái này chưa thiệt sự cần thiết
import React, { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../app/context/AuthContext';
import { SIZES } from '../constants';

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const { session } = useAuth();

    useEffect(() => {
        if (session === null) {
            router.push('/auth');
        }
    }, [session, router]);

    if (session === null) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Redirecting to Sign In...</Text>
            </View>
        );
    }

    return children;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: SIZES.xLarge,
        textAlign: 'center',
    },
});

export default ProtectedRoute;
