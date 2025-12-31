import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmojiPickerButtonProps {
    value: string;
    onChange: (emoji: string) => void;
}

const EMOJI_CATEGORIES = {
    "Education": ["🎓", "📚", "✏️", "🏫", "🎒", "📝", "📖", "🖍️", "🗣️", "💡", "🧠", "💻"],
    "Activities": ["🏃", "🎨", "🎭", "🎵", "🏆", "🥇", "🎪", "🎬", "📸", "🧩", "🎲", "🎯"],
    "Nature": ["🌱", "🌳", "🌻", "🏕️", "🌍", "☀️", "🌧️", "🌈", "🦋", "🦁", "🦕", "🍄"],
    "Objects": ["🚩", "🎁", "🔔", "📢", "🔍", "📅", "📌", "📎", "🚀", "💡", "🔑", "🎈"],
    "General": ["😀", "🎉", "🔥", "⭐", "❤️", "✅", "👋", "🤝", "👀", "✨", "💪", "🙌"]
};

export function EmojiPickerButton({ value, onChange }: EmojiPickerButtonProps) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-14 text-2xl px-4"
                >
                    <span className="flex items-center gap-3">
                        <span className="text-3xl">{value || "😊"}</span>
                        <span className="text-sm text-muted-foreground font-normal">เลือก Emoji</span>
                    </span>
                    <Smile className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-0" align="start">
                <Tabs defaultValue="Education" className="w-full">
                    <ScrollArea className="h-[300px]">
                        <div className="p-4">
                            {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                                <div key={category} className="mb-4">
                                    <h4 className="mb-2 text-xs font-semibold text-muted-foreground">{category}</h4>
                                    <div className="grid grid-cols-6 gap-2">
                                        {emojis.map((emoji) => (
                                            <Button
                                                key={emoji}
                                                variant="ghost"
                                                className="h-10 w-10 p-0 text-xl hover:bg-accent hover:text-accent-foreground"
                                                onClick={() => {
                                                    onChange(emoji);
                                                    setOpen(false);
                                                }}
                                            >
                                                {emoji}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </Tabs>
            </PopoverContent>
        </Popover>
    );
}
