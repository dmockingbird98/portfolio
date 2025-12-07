import { useState } from "react";
import "./footer.scss"
export const Footer = () => {
    const [year] = useState<number>(new Date().getFullYear());
    
    return (
        <footer>
            <div className="container">
                © <span>{year}</span> Anand Raghunathan. All rights reserved.
            </div>
        </footer>
    )
}