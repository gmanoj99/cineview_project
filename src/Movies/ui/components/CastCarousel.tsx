import { useTranslation } from "react-i18next";

import { posterUrl } from "../../../Common/core/images";
import type { CastMember } from "../../../Common/data/tmdbSchemas";

interface CastCarouselProps {
    cast: CastMember[];
}

export default function CastCarousel({ cast }: CastCarouselProps) {
    const { t } = useTranslation();
    if (cast.length === 0) {
        return (
            <div className="state state--empty">
                {t("movies:details.noCast")}
            </div>
        );
    }
    return (
        <div className="cast">
            {cast.slice(0, 20).map((member) => {
                const photo = posterUrl(member.profile_path);
                return (
                    <div key={member.id} className="cast__item">
                        <div className="cast__photo">
                            {photo ? (
                                <img
                                    src={photo}
                                    alt={member.name}
                                    loading="lazy"
                                />
                            ) : (
                                <div className="movie-card__placeholder">
                                    {t("common:state.noPhoto")}
                                </div>
                            )}
                        </div>
                        <p className="cast__name">{member.name}</p>
                        <p className="cast__char">{member.character}</p>
                    </div>
                );
            })}
        </div>
    );
}