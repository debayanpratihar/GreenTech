"use client";
import React, { useEffect, useState } from "react";
import {
    Bell,
    CircleCheck,
    CircleX,
    Cloud,
    History,
    Landmark,
    Recycle,
    X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import metal from "@/assets/aluminium.jpg";
import bottle from "@/assets/bottle.jpg";
import glass from "@/assets/glass.jpg";
import paper from "@/assets/paper.jpg";
// import Contact from "@/components/contact";
import SpinLoading from "@/components/loading/SpinLoading";

export interface ApiResponse {
    message: string;
    userData?: UserData; // userData is now optional to handle missing data
}

export interface UserData {
    city: string;
    email: string;
    isVerified: boolean;
    isWorker: boolean;
    phoneNumber: string;
    profilePicture: string;
    state: string;
    totalPointsEarned: number;
    userDescription: string;
    username: string;
    wasteDumped: WasteItem[];
}

export interface WasteItem {
    wastePoints: number; // Assuming each waste item has wastePoints
}

interface MaterialData {
    [key: string]: {
        merits: string;
        demerits: string;
    };
}

const materialData: MaterialData = {
    Plastic: {
        merits: "Plastic is versatile and lightweight.",
        demerits: "Plastic is non-biodegradable and contributes to pollution.",
    },
    Glass: {
        merits: "Glass is recyclable and does not degrade over time.",
        demerits: "Glass production requires a lot of energy.",
    },
    Paper: {
        merits: "Paper is biodegradable and recyclable.",
        demerits: "Paper production can lead to deforestation.",
    },
    Metal: {
        merits: "Metal is durable and can be recycled repeatedly.",
        demerits: "Metal extraction and processing can be energy-intensive.",
    },
};

const Page = () => {
    const [user, setUserData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [openNotification, setOpenNotification] = useState<boolean>(false);
    const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);

    const getUserData = async () => {
        try {
            const response = await fetch(`/api/auth/profile`);
            if (!response.ok) throw new Error("Failed to fetch user data");
            const data: ApiResponse = await response.json();
            if (!data.userData) throw new Error("Invalid user data");
            setUserData(data);
        } catch (error) {
            console.error(error);
            setUserData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    const handleMaterialClick = (material: string) => {
        setSelectedMaterial(material);
        setOpenModal(true);
    };

    const calculateTotalCO2Saved = () => {
        if (!user?.userData?.wasteDumped) return 0;

        return user.userData.wasteDumped.reduce((total, waste) => {
            return total + (waste.wastePoints || 0);
        }, 0);
    };

    return (
        <section className="flex flex-col gap-3 pt-2">
            {loading ? (
                <div className="min-h-screen flex justify-center items-center">
                    <SpinLoading />
                </div>
            ) : (
                <>
                    {user && user.userData ? (
                        <section className="p-2 flex flex-col gap-8 relative">
                            <div className="flex items-center justify-between">
                                <Link href={"/profile"} className="flex items-center gap-3">
                                    <img
                                        src={
                                            user.userData.profilePicture ||
                                            "https://blogger.googleusercontent.com/img/a/AVvXsEj3t_z7UXiKOFaoJlIrcoz6XGyhMnS1j8V4qs1Rzx1aXduNui3PXn4eCb9uT8wss8IplC483IZbnn7ZGeoXpMLi3LFdRHEBdmnbzyg8eRfJF-0oBmMyxuh6q3QMJ5THOSoExiFo8TQlpD-wgLT8ZWDZ8aC3RjmebZ6REA_SgNO0zvh8fuxy8l-WhGEVqBc"
                                        }
                                        className="w-12 h-12 rounded-xl"
                                        alt="User Profile"
                                    />
                                    <div className="flex flex-col gap-0">
                                        <h1 className="font-semibold text-xl capitalize">
                                            Hi, {user.userData.username || "Unknown"}
                                        </h1>
                                        <span className="text-sm font-medium opacity-70">
                                            {user.userData.state || "Unknown"}, {user.userData.city || "Unknown"}
                                        </span>
                                    </div>
                                </Link>

                                <div className="flex gap-3">
                                    <Link href={"/history"}>
                                        <History size={30} className="opacity-60" />
                                    </Link>
                                    <Bell
                                        size={30}
                                        className="opacity-60 relative"
                                        onClick={() => setOpenNotification(!openNotification)}
                                    />
                                    <div
                                        className={`w-44 h-56 z-50 overscroll-y-scroll absolute bg-white ${openNotification ? "scale-100" : "scale-0"} duration-200 rounded-lg top-16 shadow-md shadow-black/40 right-5 border-2 border-black/10`}
                                    ></div>
                                </div>
                            </div>

                            <div className="bg-green-600 shadow-2xl p-6 shadow-black/30 rounded-lg w-full">
                                <div className="flex items-center justify-between gap-4 p-4 text-white">
                                    <div className="flex flex-col justify-center items-center">
                                        <div className="border-2 rounded-full p-1">
                                            <Landmark size={32} />
                                        </div>
                                        <span className="font-semibold uppercase text-lg">
                                            {user.userData.totalPointsEarned ?? "N/A"}
                                        </span>
                                        <span className="uppercase text-xs opacity-70 font-semibold tracking-wider">Points</span>
                                    </div>

                                    <div className="h-16 w-[3px] bg-white/40"></div>

                                    <div className="flex flex-col justify-center items-center">
                                        <div className="border-2 rounded-full p-1">
                                            <Cloud size={32} />
                                        </div>
                                        <span className="font-semibold uppercase text-lg">
                                            {calculateTotalCO2Saved()}G
                                        </span>
                                        <span className="uppercase text-xs opacity-70 font-semibold tracking-wider">Saved CO2</span>
                                    </div>

                                    <div className="h-16 w-[3px] bg-white/40"></div>

                                    <div className="flex flex-col justify-center items-center">
                                        <div className="border-2 rounded-full p-1">
                                            <Recycle size={32} />
                                        </div>
                                        <span className="font-semibold uppercase text-lg">
                                            {user.userData.wasteDumped.length}
                                        </span>
                                        <span className="uppercase text-xs opacity-70 font-semibold tracking-wider">Recycled</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <h1 className="font-semibold opacity-90 text-green-900 text-2xl tracking-wide">Materials</h1>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.keys(materialData).map((material) => (
                                        <div
                                            key={material}
                                            onClick={() => handleMaterialClick(material)}
                                            className="flex justify-center items-center flex-col gap-2 shadow-lg rounded-xl p-3 border-2 border-black/10 shadow-black/10"
                                        >
                                            <Image
                                                src={material === "Plastic" ? bottle : material === "Glass" ? glass : material === "Paper" ? paper : metal}
                                                alt={material}
                                                height={200}
                                                width={200}
                                                className="h-24 w-24"
                                            />
                                            <h1>{material}</h1>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    ) : (
                        <h1 className="text-3xl font-bold text-red-500 min-h-screen">Error loading user profile</h1>
                    )}
                </>
            )}

            <div
                className={`w-full min-h-screen bg-black/70 fixed top-0 left-0 right-0 z-50 ${openModal ? "scale-100" : "scale-0"} duration-200`}
            >
                <div className="flex justify-center items-center min-h-screen rounded-lg">
                    <div className="bg-white rounded-xl w-[90%] h-72 shadow-lg shadow-white/10 overflow-y-scroll">
                        <div className="flex justify-end items-end p-4">
                            <X size={40} onClick={() => setOpenModal(!openModal)} />
                        </div>
                        {selectedMaterial && (
                            <div className="p-4 flex flex-col gap-3">
                                <h2 className="text-2xl font-semibold">{selectedMaterial}</h2>
                                <p className="text-xl font-bold">
                                    <CircleCheck size={20} color="green" /> {materialData[selectedMaterial].merits}
                                </p>
                                <p className="text-xl font-bold">
                                    <CircleX size={20} color="red" /> {materialData[selectedMaterial].demerits}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Page;
