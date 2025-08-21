import React, { useState, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';

function HomePage(){
    const [repoUrl, setRepoUrl] = useState('');
    const loadingBarRef = useRef(null);

    const handleGenerateReadme = async () => {
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }

        try {

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/generate?url=${encodeURIComponent(repoUrl)}`);
            // const response = await fetch(`http://localhost:3000/api/generate?url=${encodeURIComponent(repoUrl)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const readmeContent = await response.text();

            // Create a Blob with the text content
            const blob = new Blob([readmeContent], { type: 'text/markdown' });

            // Create a temporary URL for the Blob
            const url = URL.createObjectURL(blob);

            // Create a temporary anchor element
            const a = document.createElement('a');
            a.href = url;
            a.download = 'README.md'; // Set the download file name

            // Append to body, click, and remove
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Clean up the URL object
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Failed to generate or download README:", error);
            alert("Failed to generate README. Please try again."); // Simple error notification
        } finally {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
        }
    };

    const handleKeyDown = (event) => {
        if(event.key == 'Enter'){
            handleGenerateReadme();
        }
    }

    return (
        <>
            <LoadingBar color="#f11946" ref={loadingBarRef} />
            <div className='flex justify-center flex-col items-center fixed top-[calc(50%-50px)] left-1/2 -translate-x-1/2 -translate-y-1/2'>
                <img src={'/assets/dark-theme-logo.png'} className='h-[250px]' alt="Logo"/>
                <div className='p-12 pt-1 whitespace-nowrap mb-4'>Instantly generate a beautiful README from your GitHub repo</div>
                <div className='flex justify-center items-center gap-4 '>
                    <input
                        placeholder='paste your repo URL here'
                        className='border focus:border-white p-4 pl-6 h-10 w-[50vw] rounded-[5px]'
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {/* <button
                        className='p-0 h-10 border rounded-[3px] flex items-center justify-center'
                        onClick={handleGenerateReadme}
                    >
                        <img src={"/assets/icons/box-arrow.svg"} className='h-[100%]' alt="generate" />
                    </button> */}
                </div>
            </div>
        </>
    );
}

export default HomePage;


