"use client";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BrainIcon,
  RabbitIcon,
  ZapIcon,
} from "lucide-react";
import { useConfigStore } from "@/stores";
import { ChatModel } from "../../generated";

type Model = {
  name: string;
  description: string;
  value: string;
  smallIcon: React.ReactNode;
  icon: React.ReactNode;
};

export const modelMap: Record<ChatModel, Model> = {
  [ChatModel.SONAR_FREE]: {
    name: "Fast",
    description: "Perplexity Sonar (Web Search)",
    value: ChatModel.SONAR_FREE,
    smallIcon: <RabbitIcon className="w-4 h-4 text-cyan-400" />,
    icon: <RabbitIcon className="w-5 h-5 text-cyan-400" />,
  },
  [ChatModel.DEEPSEEK_V4_FLASH]: {
    name: "Powerful",
    description: "DeepSeek V4 Flash",
    value: ChatModel.DEEPSEEK_V4_FLASH,
    smallIcon: <ZapIcon className="w-4 h-4 text-yellow-400" />,
    icon: <ZapIcon className="w-5 h-5 text-yellow-400" />,
  },
  [ChatModel.NEMOTRON_3_ULTRA]: {
    name: "Expert",
    description: "NVIDIA Nemotron Ultra 550B",
    value: ChatModel.NEMOTRON_3_ULTRA,
    smallIcon: <BrainIcon className="w-4 h-4 text-emerald-400" />,
    icon: <BrainIcon className="w-5 h-5 text-emerald-400" />,
  },
};

const ModelItem: React.FC<{ model: Model }> = ({ model }) => (
  <SelectItem
    key={model.value}
    value={model.value}
    className="flex flex-col items-start p-2"
  >
    <div className="flex items-center space-x-2">
      {model.icon}
      <div className="flex flex-col">
        <span className="font-bold">{model.name}</span>
        <span className="text-muted-foreground">{model.description}</span>
      </div>
    </div>
  </SelectItem>
);

export function ModelSelection() {
  const { model, setModel } = useConfigStore();
  const selectedModel = modelMap[model] ?? modelMap[ChatModel.SONAR_FREE];

  return (
    <Select
      defaultValue={model}
      value={model}
      onValueChange={(value) => {
        if (value) {
          setModel(value as ChatModel);
        }
      }}
    >
      <SelectTrigger className="w-fit space-x-2 bg-transparent outline-none border-none select-none focus:ring-0 shadow-none transition-all duration-200 ease-in-out hover:scale-[1.05] text-sm">
        <SelectValue>
          <div className="flex items-center space-x-2">
            {selectedModel.smallIcon}
            <span className="font-semibold">{selectedModel.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="w-[260px]">
        <SelectGroup>
          {Object.values(modelMap).map((m) => (
            <ModelItem key={m.value} model={m} />
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
