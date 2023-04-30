import React, {useState} from "react";
import {AiOutlineMenu} from "react-icons/ai";
import {ImCancelCircle} from "react-icons/im";
import Discover from "./Discover";
import Footer from "./Footer";
import SuggestedAccounts from "./SuggestedAccounts";
import Menu from "./Menu";
import ConversationsWrapper from "../chat/conversations/ConversationsWrapper";
import {Session} from "next-auth";

interface ISidebarProps {
    currentPage: string;
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
    session: Session
}

const Sidebar = ({currentPage, setCurrentPage, session}: ISidebarProps) => {
    const [showSidebar, setShowSidebar] = useState(true);
    return (
        <div>
            <div
                className="block xl:hidden m-2 ml-4 mt-3 text-xl"
                onClick={() => setShowSidebar((prev) => !prev)}
            >
                {showSidebar ? <ImCancelCircle/> : <AiOutlineMenu/>}
            </div>
            {showSidebar && (
                <div
                    className="xl:w-400 w-20 flex flex-col justify-start mb-10 border-r-2 border-gray-100 xl:border-0 p-3 overflow-x-hidden">
                    <Menu setCurrentPage={setCurrentPage}/>

                    {currentPage === "home" && (
                        <>
                            <Discover/>
                            <SuggestedAccounts/>
                            <Footer/>
                        </>
                    )}

                    {currentPage === "messages" && (
                        <>
                            <ConversationsWrapper session={session}/>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Sidebar;
