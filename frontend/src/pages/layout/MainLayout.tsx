import React, {ReactElement} from 'react';
import ModalProvider from "../../context/ModalContext";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";

interface IMainLayout {
    children: ReactElement
}

const MainLayout = ({children}: IMainLayout) => {
    const {data: session} = useSession();

    return (
        <div className="xl:w-[1200px] m-auto overflow-hidden h-[100vh]">
            <ModalProvider>
                <Navbar/>
                <div className="flex gap-6 md:gap-20">
                    <div
                        className="h-[92vh] overflow-hidden border-r-2 xl:border-none">
                        <Sidebar session={session as Session}/>
                    </div>
                    <div className="flex flex-col gap-10 h-[100vh] mt-2 videos flex-1">
                        <div className="flex flex-col gap-10 overflow-auto videos h-full">
                            {children}
                        </div>
                    </div>
                </div>
            </ModalProvider>
        </div>
    );
};

export default MainLayout;
