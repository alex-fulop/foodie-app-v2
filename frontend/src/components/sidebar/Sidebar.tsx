import React, {useState} from "react";
import Discover from "./Discover";
import Footer from "./Footer";
import SuggestedAccounts from "./SuggestedAccounts";
import Menu from "./Menu";
import ConversationsWrapper from "../chat/conversations/ConversationsWrapper";
import {Session} from "next-auth";
import {useRouter} from "next/router";

const Sidebar = ({session}: {session: Session}) => {
    const [showSidebar, setShowSidebar] = useState(true);
    const router = useRouter();

    return (
        <div>
            <div
                className="block xl:hidden m-2 ml-4 mt-3 text-xl"
                onClick={() => setShowSidebar((prev) => !prev)}
            >
            </div>
            {showSidebar && (
                <div
                    className="xl:w-400 w-20 flex flex-col justify-start mb-10 xl:border-0 p-3 overflow-x-hidden">
                    <Menu/>
                    {router.pathname === "/chat" ? (
                        <div className='hidden xl:block'>
                            <ConversationsWrapper session={session as Session}/>
                        </div>
                    ) : (
                        <div>
                            <Discover/>
                            <SuggestedAccounts/>
                            <Footer/>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Sidebar;
