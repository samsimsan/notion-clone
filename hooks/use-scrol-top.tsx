import { useState, useEffect } from "react";

// a custom hook that tells you if the screen has been scrolled beyound the "threshold"
const useScrollTop = (threshold = 10) => {
    const [scrolled, setscrolled] = useState(false)
    // this is used to set the value of scrolled
    useEffect(() => { 
        const handleScrolled = () => {
            if (window.scrollY > threshold) {
                setscrolled(true);
            } else {
                setscrolled(false);
            }
        }
        window.addEventListener("scroll", handleScrolled);
        return () => window.removeEventListener("scroll", handleScrolled);
    }, [threshold])

    return scrolled;
}

export default useScrollTop;