import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  videoId: string;
}

interface VideoPlayerCommentsProps {
  comments: Comment[];
  onAddComment: (comment: string) => void;
}

export const VideoPlayerComments = ({ comments, onAddComment }: VideoPlayerCommentsProps) => {
  const { t } = useTranslation();
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment("");
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-6 h-6" />
        <h2 className="text-2xl font-semibold">{t('comments.title')}</h2>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('comments.addComment')}
            className="flex-grow"
          />
          <Button type="submit">{t('comments.submit')}</Button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-4 rounded-lg bg-card border animate-fade-in"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold">{comment.author}</span>
              <span className="text-sm text-muted-foreground">
                {comment.timestamp}
              </span>
            </div>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};