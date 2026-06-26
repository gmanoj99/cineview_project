import { useTranslation } from "react-i18next";

interface TrailerModalProps {
    youtubeKey: string;
    onClose: () => void;
}

export default function TrailerModal({
    youtubeKey,
    onClose,
}: TrailerModalProps) {
    const { t } = useTranslation();
    return (
        <div className="modal" role="dialog" aria-modal="true" onClick={onClose}>
            <div
                className="modal__content"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    className="modal__close"
                    onClick={onClose}
                    aria-label={t("common:actions.closeTrailer")}
                >
                    ✕
                </button>
                <div className="modal__video">
                    <iframe
                        src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1`}
                        title={t("common:actions.playTrailer")}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    );
}