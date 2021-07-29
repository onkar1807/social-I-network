import React from 'react'
import {
    EmailShareButton, EmailIcon,
    FacebookShareButton, FacebookIcon,
    TelegramShareButton, TelegramIcon,
    LinkedinShareButton, LinkedinIcon,
    TwitterShareButton, TwitterIcon,
    WhatsappShareButton, WhatsappIcon,
  } from "react-share";

const ShareModal = ({ url, theme }) => {
    return (
        <div 
            className="d-flex justify-content-between px-4 py-2 bg-light"
            style={{filter: theme ? 'invert(1)' : 'invert(0)',}}
        >
            <FacebookShareButton url={url}>
                <FacebookIcon round={true} size={32} />
            </FacebookShareButton>
            <WhatsappShareButton url={url}>
                <WhatsappIcon round={true} size={32} />
            </WhatsappShareButton>
            <TwitterShareButton url={url}>
                <TwitterIcon round={true} size={32} />
            </TwitterShareButton>
            <TelegramShareButton url={url}>
                <TelegramIcon round={true} size={32} />
            </TelegramShareButton>
            <LinkedinShareButton url={url}>
                <LinkedinIcon round={true} size={32} />
            </LinkedinShareButton>
            <EmailShareButton url={url}>
                <EmailIcon round={true} size={32} />
            </EmailShareButton>
        </div>
    )
}

export default ShareModal
