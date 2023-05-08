import React, {ReactElement} from 'react';
import ModalProvider from "../../context/ModalContext";
import Navbar from "../../components/Navbar";

interface IMainLayout {
    children: ReactElement
}

const MainLayout = ({children}: IMainLayout) => {
    return (
        <div className="xl:w-[1200px] m-auto overflow-hidden h-[100vh]">
            <ModalProvider>
                <Navbar/>
                <div className="flex gap-6 md:gap-20">
                    {children}
                </div>
            </ModalProvider>
        </div>
    );
};

export default MainLayout;
