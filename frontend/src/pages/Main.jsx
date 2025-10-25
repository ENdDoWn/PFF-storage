import { useState, useEffect } from "react";
import { fetchUserAttributes } from 'aws-amplify/auth';

import Header from "../components/user/HeaderMain"
import Product from "../components/user/ProductManage"

function Main(){
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const attributes = await fetchUserAttributes();
            setUserInfo({
                email: attributes.email,
                name: attributes.name || '',
                nickname: attributes.nickname || '', // company name
                phone_number: attributes.phone_number || '',
                address: attributes.address || ''
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-[#f2f2f2] w-full h-screen flex items-center justify-center">
                <div className="text-xl font-semibold">Loading...</div>
            </div>
        );
    }

    return(
        <div className="bg-[#f2f2f2] w-full h-full">
            <Header userInfo={userInfo} />
            <Product userInfo={userInfo} />
        </div>
    )
}

export default Main;