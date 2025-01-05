import React, { useEffect, useState } from "react";
import "./UploadMangaPage.scss";
import { fetchMangaById } from "../../api/mangaAPI";
import ComicCard from "../../components/socialComponents/comicCardSmall/ComicCard";
import { Typography } from "@mui/material";
import { supabase } from "../../utils/supabase";
import { uploadImage } from "../../api/fileUploadAPI";
import { fetchGroupIdByName } from "../../api/scocialAPI";
import GroupCardLarge from "../../components/socialComponents/group-card-large/GroupCardLarge";

const UploadMangaPage = () => {
    const queryParams = new URLSearchParams(location.search);
    const manga_id = queryParams.get("manga_id") || "";
    const group_name = queryParams.get("group") || "";
    const [files, setFiles] = useState<File[]>([]);
    const [formData, setFormData] = useState({
        mangaId: manga_id,
        volume: "",
        chapter: "",
        title: "",
        language: "en",
        translatedBy: group_name,
    });

    const [userId, setUserId] = useState("");
    const [uploading, setUploading] = useState<boolean>(false);
    const [idValid, setIdValid] = useState<boolean>(true);
    const [comic, setComic] = useState<any>(null);
    const [groupId, setGroupId] = useState<any>(null);
    const [idError, setIdError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
            setFiles((prevFiles) => [
                ...prevFiles,
                ...selectedFiles.sort((a, b) => a.name.localeCompare(b.name)),
            ]);
        }
    };

    const handleRemoveImage = (index: number) => {
        setFiles((prevFiles) => {
            const newFiles = [...prevFiles];
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const uploadToMangaDex = async () => {
        const baseUrl = "https://api.mangadex.org";
        const username = "VuiVL"; // Replace with your MangaDex username
        const password = "vuivl23072003"; // Replace with your MangaDex password
        const groupIDs = ["18dadd0b-cbce-41c4-a8a9-5e653780b9ff"]; // Replace with your group ID

        let sessionToken: string;
        let sessionID: string;

        try {
            // Step 1: Login and get the session token
            const loginResponse = await fetch(`${baseUrl}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!loginResponse.ok) {
                const errorData = await loginResponse.json();
                console.error("Login failed:", errorData);
                alert("Login failed. Please check your username and password.");
                return;
            }

            const loginData = await loginResponse.json();
            sessionToken = loginData.token.session;

            console.log("Session token retrieved:", sessionToken);

            // Step 2: Start an upload session
            const sessionResponse = await fetch(`${baseUrl}/upload/begin`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    groups: groupIDs,
                    manga: formData.mangaId, // Use the manga ID from the form
                }),
            });

            if (!sessionResponse.ok) {
                const errorData = await sessionResponse.json();
                console.error("Failed to start upload session:", errorData);
                alert("Failed to start an upload session. Abandon any existing session if necessary.");
                return;
            }

            const sessionData = await sessionResponse.json();
            sessionID = sessionData.data.id;

            console.log("Upload session started with ID:", sessionID);

            // Step 3: Upload images
            const batches = [];
            const batchSize = 5;

            for (let i = 0; i < files.length; i += batchSize) {
                batches.push(files.slice(i, i + batchSize));
            }

            const successfulUploads = [];
            const failedUploads = [];

            for (const batch of batches) {
                const formDataToSubmit = new FormData();
                batch.forEach((file, index) => {
                    formDataToSubmit.append(`file${index + 1}`, file, file.name);
                });

                const uploadResponse = await fetch(`${baseUrl}/upload/${sessionID}`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    body: formDataToSubmit,
                });

                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    console.error("Failed to upload images:", errorData);
                    failedUploads.push(...batch);
                } else {
                    const uploadData = await uploadResponse.json();
                    successfulUploads.push(...uploadData.data);
                }
            }

            console.log("Successful uploads:", successfulUploads);
            console.log("Failed uploads:", failedUploads);

            if (successfulUploads.length === 0) {
                alert("Image upload failed. Please try again.");
                return;
            }

            // Step 4: Rearrange pages and commit upload
            successfulUploads.sort((a, b) => {
                const nameA = a.attributes.originalFileName.toUpperCase();
                const nameB = b.attributes.originalFileName.toUpperCase();
                return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
            });

            const pageOrder = successfulUploads.map((upload) => upload.id);
            const chapterDraft = {
                volume: formData.volume || null,
                chapter: formData.chapter,
                translatedLanguage: formData.language,
                title: formData.title,
            };

            const commitResponse = await fetch(`${baseUrl}/upload/${sessionID}/commit`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chapterDraft,
                    pageOrder,
                }),
            });

            if (!commitResponse.ok) {
                const errorData = await commitResponse.json();
                console.error("Failed to commit upload session:", errorData);
                alert("Failed to commit the upload session.");
                return;
            }

            const commitData = await commitResponse.json();
            console.log("Upload session successfully committed:", commitData);

            alert("Manga upload successful!");
        } catch (error) {
            console.error("Error during the upload process:", error);
            alert("An error occurred during the upload process. Please try again.");
        }
    };

    const uploadChapter = async () => {
        setUploading(true);

        console.log(formData);
        const sortedFiles = [...files].sort((a, b) => a.name.localeCompare(b.name));

        try {
            const { data: insertedData, error: postError } = await supabase
                .from('Chapter')
                .insert([
                    {
                        manga_id: formData.mangaId,
                        title: formData.title,
                        volume: formData.volume, // Fixed typo from "volumn"
                        chapterNumber: formData.chapter,
                        translatedLanguage: formData.language,
                        groupId: formData.translatedBy,
                    },
                ])
                .select('id');

            if (postError) {
                console.error("RPC upload_chapter error:", postError);
                throw postError;
            }

            console.log(insertedData[0].id);

            for (let i = 0; i < sortedFiles.length; i++) {
                const imageFile = sortedFiles[i];

                const result = await uploadImage(userId, imageFile);
                if (!result) {
                    throw new Error("Image upload failed");
                }

                const { error: rpcImageError } = await supabase.rpc(
                    "upload_chapter_image",
                    {
                        this_name: result.imageName,
                        this_chapter_id: insertedData[0].id,
                        this_link: result.publicUrl,
                    }
                );

                if (rpcImageError) {
                    console.error("RPC upload_post_image error:", rpcImageError);
                    throw rpcImageError;
                }
            }

            alert("Manga upload successful!");
            setUploading(false);
        } catch (error) {
            console.error("Upload failed:", error);
            setUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) {
            alert("Please upload at least one file.");
            return;
        }
        uploadChapter();
    };

    const fetchManga = () => {
        if (formData.mangaId.trim() !== "") {
            fetchMangaById(formData.mangaId.trim())
                .then((response) => {
                    setComic(response);
                    setIdValid(true);
                    setIdError(null);
                })
                .catch((error) => {
                    console.error("Invalid manga ID:", error);
                    setIdValid(false);
                    setComic(null);
                    setIdError(
                        "Invalid manga ID, please copy from the link. Example: 09b80517-f0d6-44bd-94a6-0794da2e18d8"
                    );
                });
        } else {
            setIdValid(true);
            setComic(null);
            setIdError(null);
        }
    };

    // Trigger fetchManga whenever formData.mangaId changes
    useEffect(() => {
        fetchManga();
    }, [formData.mangaId]);

    const fetchGroup = async () => {
        if (formData.translatedBy) {
            const group_id = await fetchGroupIdByName(formData.translatedBy);
            setGroupId(group_id.id);
        }
    };

    // Trigger fetchManga whenever formData.mangaId changes
    useEffect(() => {
        fetchGroup();
    }, [formData.translatedBy]);

    useEffect(() => {
        const getUser = async () => {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();
                if (user !== null) {
                    setUserId(user.id);
                } else {
                    setUserId("");
                }
            } catch (e) {
                console.error("Error fetching user:", e);
            }
        };
        getUser();
    }, []);

    return (
        <div className="upload-manga-page">
            {uploading && (
                <div className="upload-progress">
                    <Typography variant="body2" component="p">
                        Đang upload hình, đợi xíu...
                    </Typography>
                </div>
            )}
            <div className="container">
                <h1>Upload Manga to MangaDex</h1>

                {/* Upload Section */}
                <div className="upload-section">
                    <input
                        type="file"
                        id="file-input"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        hidden
                    />
                    <label htmlFor="file-input" className="upload-label">
                        Click to upload or drag & drop files here
                    </label>
                    <div className="preview-container">
                        {files.map((file, index) => (
                            <div className="preview-item" key={index} style={{ position: "relative" }}>
                                <img src={URL.createObjectURL(file)} alt="Preview" />
                                <button
                                    onClick={() => handleRemoveImage(index)}
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "32px",
                                        height: "32px",
                                        cursor: "pointer",
                                        backdropFilter: "blur(8px)",
                                    }}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Section */}
                <form className="form-section" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="mangaId">Manga ID *</label>
                        <input
                            type="text"
                            id="mangaId"
                            name="mangaId"
                            value={formData.mangaId}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    {idValid && comic && (
                        <ComicCard
                            cover={
                                comic.relationships.find((r: any) => r.type === "cover_art")
                                    ?.attributes.fileName
                            }
                            title={comic.attributes.title.en}
                            comictype={comic.type}
                            maintag={comic.attributes.tags[0].attributes.name.en}
                            id={comic.id}
                        />
                    )}
                    <div className="form-group">
                        <label htmlFor="volume">Volume</label>
                        <input
                            type="text"
                            id="volume"
                            name="volume"
                            value={formData.volume}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="chapter">Chapter *</label>
                        <input
                            type="text"
                            id="chapter"
                            name="chapter"
                            value={formData.chapter}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="language">Language *</label>
                        <select
                            id="language"
                            name="language"
                            value={formData.language}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="en">English</option>
                            <option value="jp">Japanese</option>
                            <option value="vi">Vietnamese</option>
                            <option value="zh">Chinese</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="translatedBy">Translated By *</label>
                        <input
                            type="text"
                            id="translatedBy"
                            name="translatedBy"
                            value={formData.translatedBy}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    {groupId && (
                        <GroupCardLarge
                            key={groupId}
                            userID={groupId}
                            fetchSuggestUser={fetchGroup}
                        />
                    )}

                    <button type="submit" className="submit-btn">
                        Upload to MangaDex
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadMangaPage;
