import React, { useEffect, useState } from 'react';
import {
    View,
    Image as RNImage,
    ImageProps as RNImageProps,
    ImageSourcePropType,
    StyleSheet,
    ImageStyle,
    ViewStyle,
} from 'react-native';

export interface CustomImageProps extends RNImageProps {
    fallbackSource?: ImageSourcePropType;
}

/**
 * Shows fallbackSource until the real image loads. If the real image errors,
 * fallback remains visible. The container uses the passed `style` for sizing.
 */
export function CustomImage({
    source,
    fallbackSource,
    style,
    onLoad,
    onError,
    ...props
}: CustomImageProps) {
    const [loaded, setLoaded] = useState(false);
    const [errored, setErrored] = useState(false);

    // reset state when source changes
    useEffect(() => {
        setLoaded(false);
        setErrored(false);
    }, [source]);

    const handleLoad = (e: any) => {
        setLoaded(true);
        onLoad && onLoad(e);
    };

    const handleError = (e: any) => {
        setErrored(true);
        onError && onError(e);
    };

    // Container uses the passed style so width/height apply to it; images fill the container.
    return (
        <View style={[styles.container, style as ViewStyle]}>
            {/* Fallback shown while not loaded (or when errored) */}
            {fallbackSource && (!loaded || errored) && (
                <RNImage
                    source={fallbackSource}
                    style={[styles.image, StyleSheet.absoluteFill]}
                    resizeMode={props.resizeMode ?? 'cover'}
                />
            )}

            {/* Actual image: invisible until loaded; removed if errored */}
            {!errored && (
                <RNImage
                    {...props}
                    source={source}
                    onLoad={handleLoad}
                    onError={handleError}
                    style={
                        [
                            styles.image,
                            StyleSheet.absoluteFill,
                            // keep it invisible until load finishes so fallback is visible underneath
                            { opacity: loaded ? 1 : 0 },
                        ] as ImageStyle
                    }
                    resizeMode={props.resizeMode ?? 'cover'}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
