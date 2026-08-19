import { useState } from "react";
import PageHeader from "../../../components/PageHeader";
import Button from "../../../components/Button";
import { COLLABORATORS, handleShare } from "../../../lib/dashboard";
import styles from "./ChannelsPage.module.scss";

type ConnectionState = "connected" | "paused" | "disconnected";

interface Channel {
  id: string;
  name: string;
  description: string;
  iconSrc: string;
  state: ConnectionState;
}

const INITIAL_CHANNELS: Channel[] = [
  {
    id: "instagram",
    name: "Instagram",
    description:
      "Never miss an Instagram DM. Your AI replies to customers instantly, 24/7.",
    iconSrc: "/social/insta.png",
    state: "paused",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description:
      "Handle WhatsApp messages automatically. Capture leads while you sleep.",
    iconSrc: "/social/whatsapp.png",
    state: "connected",
  },
  {
    id: "messenger",
    name: "Messenger",
    description:
      "Turn Facebook DMs into leads. Your AI handles every message, day or night.",
    iconSrc: "/social/messanger.png",
    state: "disconnected",
  },
];

export function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);

  const setChannelState = (id: string, state: ConnectionState) => {
    setChannels((prev) =>
      prev.map((channel) =>
        channel.id === id ? { ...channel, state } : channel,
      ),
    );
  };

  return (
    <div>
      <PageHeader
        title="Channels"
        collaborators={COLLABORATORS}
        onShare={handleShare}
      />

      <div className={styles.page}>
        <div className={styles.grid}>
          <div className={`${styles.card} ${styles.imageCard}`}>
            <img
              src="/wingman/chat-widget.png"
              alt="Chat widget preview"
              className={styles.cardImage}
            />
            <div className={styles.cardBody}>
              <div className={styles.cardText}>
                <h3 className={styles.cardTitle}>Chat widget</h3>
                <p className={styles.cardDescription}>
                  Embed an AI chat widget directly onto your website.
                </p>
              </div>
              <div className={styles.cardActions}>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </div>
          </div>

          {channels.map((channel) => (
            <div key={channel.id} className={styles.card}>
              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <img
                    src={channel.iconSrc}
                    alt=""
                    className={styles.channelIcon}
                  />
                  {channel.state !== "disconnected" && (
                    <span
                      className={`${styles.statusBadge} ${
                        channel.state === "connected"
                          ? styles.statusOnline
                          : styles.statusOffline
                      }`}
                    >
                      <span className={styles.statusDot} aria-hidden="true" />
                      {channel.state === "connected" ? "Online" : "Offline"}
                    </span>
                  )}
                </div>

                <div className={styles.cardText}>
                  <h3 className={styles.cardTitle}>{channel.name}</h3>
                  <p className={styles.cardDescription}>
                    {channel.description}
                  </p>
                </div>

                <div className={styles.cardActions}>
                  {channel.state === "disconnected" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setChannelState(channel.id, "connected")}
                    >
                      Connect
                    </Button>
                  )}
                  {channel.state === "connected" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setChannelState(channel.id, "paused")}
                      >
                        Pause
                      </Button>
                      <Button
                        variant="outlineDanger"
                        size="sm"
                        onClick={() =>
                          setChannelState(channel.id, "disconnected")
                        }
                      >
                        Disconnect
                      </Button>
                    </>
                  )}
                  {channel.state === "paused" && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          setChannelState(channel.id, "connected")
                        }
                      >
                        Deploy
                      </Button>
                      <Button
                        variant="outlineDanger"
                        size="sm"
                        onClick={() =>
                          setChannelState(channel.id, "disconnected")
                        }
                      >
                        Disconnect
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
