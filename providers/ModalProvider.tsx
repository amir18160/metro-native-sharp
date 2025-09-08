import React from 'react';
import AnimatedModalCenter from '~/components/common/AnimatedModalCenter';

const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
            {children}
            <AnimatedModalCenter />
        </>
    );
};

export default ModalProvider;
