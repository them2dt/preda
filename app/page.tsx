"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div id="home" className="flex-column-center-center">
      <div id="home-container" className="flex-column-center-center">
        <div className="home-title font-h1  flex-column-center-center">
          Preda
        </div>
        <div className="home-description font-text flex-column-center-center">
          One platform for every token. Built by Emptea Studios.
        </div>
        <div className="links flex-row-center-center">
          <Link href="/lab" target="_blank">
            <div className="anchor flex-column-start-start">
              <div className="anchor-title font-h4">The Lab</div>
              <div className="anchor-description font-text">
                Create tokens within seconds.
              </div>
            </div>
          </Link>
          <Link href="/gallery" target="_blank">
            <div className="anchor flex-column-start-start">
              <div className="anchor-title font-h4">Gallery</div>
              <div className="anchor-description font-text">
                Maintain your assets and view them in a beautiful gallery.
              </div>
            </div>
          </Link>
          <Link href="/profile" target="_blank">
            <div className="anchor flex-column-start-start">
              <div className="anchor-title font-h4">Profile</div>
              <div className="anchor-description font-text">Coming soon.</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
