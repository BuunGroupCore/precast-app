import { FaDice } from "react-icons/fa";

import { THIRD_PARTY_APIS } from "@/config/constants";

interface AvatarGeneratorProps {
  avatarSeed: string;
  isLoading: boolean;
  onGenerateNew: () => void;
  onLoadComplete: () => void;
}

/**
 * Avatar generator component with DiceBear integration.
 * Displays a Notionists style avatar with a dice button to generate new ones.
 */
export function AvatarGenerator({
  avatarSeed,
  isLoading,
  onGenerateNew,
  onLoadComplete,
}: AvatarGeneratorProps) {
  return (
    <div className="mb-8 text-center">
      <div className="inline-block relative">
        <div className="border-6 border-comic-black rounded-full overflow-hidden bg-comic-white shadow-xl">
          <img
            src={`${THIRD_PARTY_APIS.DICEBEAR_NOTIONISTS}?seed=${avatarSeed}`}
            alt="Your Hero Avatar"
            className="w-32 h-32"
            onLoad={onLoadComplete}
          />
        </div>
        <button
          type="button"
          onClick={onGenerateNew}
          disabled={isLoading}
          className={`absolute -bottom-2 -right-2 p-3 rounded-full border-4 border-comic-black shadow-lg transition-colors ${
            isLoading
              ? "bg-comic-gray text-comic-black/50 cursor-not-allowed"
              : "bg-comic-yellow text-comic-black hover:bg-comic-orange cursor-pointer"
          }`}
          title="Generate new avatar"
        >
          <FaDice className={`text-xl ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>
      <p className="font-comic text-sm text-comic-black/70 mt-3">
        Click the dice to generate a new avatar!
      </p>
    </div>
  );
}
