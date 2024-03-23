"use client";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Home() {
  return (
    <div id="home" className="flex-column-center-center">
      <div className="section flex-row-center-center">
        <div className="container flex-row-center-center">
          <div className="legend flex-column-center-start">
            <div className="slogan font-h1">
              Operating tokens has never been this easy.
            </div>
            <Link href={"/lab"} target="_blank">
              <div className="launcher flex-row-center-center font-h4">
                Launch Preda
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="section text-container flex-column-center-center">
        <div className="font-h4">One platform for all your tokens.</div>
        <div className="font-text">
          Preda is a platform that allows you to operate tokens on multiple
          blockchains. It is designed to be simple, secure and fast. Whether you
          need to launch a Memecoin, a NFT for your Artwork or you just need to
          get rid of some spams, Preda has the tools you need.
        </div>
      </div>
      <div className="section text-container flex-column-center-center">
        <div className="font-h4">Creator Studio</div>
        <div className="font-text">
          The creator studio is a powerhouse, designed to create any token
          within seconds. With a intuitive interface, you can create SPLs, pNFTs
          and cNFTs like a pro.
        </div>
      </div>
      <div className="section text-container flex-column-center-center">
        <div className="font-h4">Atelier</div>
        <div className="font-text">
          The Atelier offers you a great way to manage your tokens. Burn,
          duplicate & transfer one or more tokens with one click.
        </div>
      </div>
      <div className="section text-container flex-column-center-center">
        <div className="font-text">
          Preda is built througout the Colosseum Hackathon.
        </div>
      </div>
    </div>
  );
}
