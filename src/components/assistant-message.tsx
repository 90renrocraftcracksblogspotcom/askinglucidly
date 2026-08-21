import { MessageComponent, MessageComponentSkeleton } from "./message";
import RelatedQuestions from "./related-questions";
import { SearchResultsSkeleton, SearchResults } from "./search-results";
import { Section } from "./section";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ImageSection, ImageSectionSkeleton } from "./image-section";
import { ChatMessage } from "../../generated";

export function ErrorMessage({ content }: { content: string }) {
  return (
    <Alert className="bg-red-500/5 border-red-500/15 p-5">
      <AlertCircle className="h-4 w-4 stroke-red-500 stroke-2" />
      <AlertDescription className="text-base text-foreground">
        {content.split(" ").map((word, index) => {
          const urlPattern = /(https?:\/\/[^\s]+)/g;
          if (urlPattern.test(word)) {
            return (
              <a
                key={index}
                href={word}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {word}
              </a>
            );
          }
          return word + " ";
        })}
      </AlertDescription>
    </Alert>
  );
}

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "./ui/button";

export const AssistantMessageContent = ({
  message,
  isStreaming = false,
  onRelatedQuestionSelect,
}: {
  message: ChatMessage;
  isStreaming?: boolean;
  onRelatedQuestionSelect: (question: string) => void;
}) => {
  const {
    sources,
    content,
    related_queries,
    images,
    is_error_message = false,
  } = message;

  const [copied, setCopied] = useState(false);

  if (is_error_message) {
    return <ErrorMessage content={message.content} />;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col space-y-4">
      {sources && sources.length > 0 && (
        <Section title="Sources" animate={isStreaming}>
          <SearchResults results={sources} />
        </Section>
      )}

      {images && images.length > 0 && (
        <Section title="Images" animate={isStreaming}>
          <ImageSection images={images} />
        </Section>
      )}

      <Section title="Answer" animate={isStreaming} streaming={isStreaming}>
        {content ? (
          <div className="relative group">
            <MessageComponent message={message} isStreaming={isStreaming} />
            {!isStreaming && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="absolute -bottom-6 -right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
              </Button>
            )}
          </div>
        ) : (
          <MessageComponentSkeleton />
        )}
      </Section>

      {related_queries && related_queries.length > 0 && (
        <Section title="Related" animate={isStreaming}>
          <RelatedQuestions
            questions={related_queries}
            onSelect={onRelatedQuestionSelect}
          />
        </Section>
      )}
    </div>
  );
};
