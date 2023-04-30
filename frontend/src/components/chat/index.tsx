import React, {useState} from "react";
import {Video} from "../../../types";
import Navbar from "../Navbar";
import Sidebar from "../sidebar/Sidebar";
import Feed from "../Feed";
import FeedWrapper from "./feed/FeedWrapper";
import {Session} from "next-auth";
import {Flex} from "@chakra-ui/react";
import ModalProvider from "../../context/ModalContext";

interface IChatProps {
    videos: Video[]
    session: Session
}

const Chat: React.FC<IChatProps> = ({videos, session}) => {
    const [currentPage, setCurrentPage] = useState<string>("home");

    return (
        <div className="xl:w-[1200px] m-auto overflow-hidden h-[100vh]">
            <ModalProvider>
                <Navbar/>
                <div className="flex gap-6 md:gap-20">
                    <div className="h-[92vh] overflow-hidden xl:hover:overflow-auto">
                        <Sidebar session={session} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
                    </div>
                    <div className="mt-4 flex flex-col gap-10 overflow-auto h-[88vh] videos flex-1">
                        <div className="flex flex-col gap-10 videos h-full">
                            {currentPage === "home" && (
                                <Feed videos={videos}/>
                            )}
                            {currentPage === "messages" && (
                                <Flex height="100vh">
                                    <FeedWrapper session={session}/>
                                </Flex>
                            )}
                        </div>
                    </div>
                </div>
            </ModalProvider>
        </div>


    );
};

export default Chat;
