import type { Logger } from "pino";

import type { AgentCapabilityFlags, AgentMode } from "../agent-sdk-types.js";
import {
  checkProviderLaunchAvailable,
  resolveProviderLaunch,
  type ProviderRuntimeSettings,
} from "../provider-launch-config.js";
import { ACPAgentClient } from "./acp-agent.js";
import {
  formatProviderDiagnostic,
  formatProviderDiagnosticError,
  buildBinaryDiagnosticRows,
  buildCommandResolutionDiagnosticRows,
} from "./diagnostic-utils.js";

const QODER_CAPABILITIES: AgentCapabilityFlags = {
  supportsStreaming: true,
  supportsSessionPersistence: true,
  supportsDynamicModes: true,
  supportsMcpServers: true,
  supportsReasoningStream: true,
  supportsToolInvocations: true,
};

export const QODER_MODES: AgentMode[] = [
  {
    id: "default",
    label: "Default",
    description: "Standard agent mode with permission prompts",
  },
  {
    id: "yolo",
    label: "YOLO (Auto-approve)",
    description: "Skip all permission prompts. Use with caution.",
  },
];

interface QoderACPAgentClientOptions {
  logger: Logger;
  runtimeSettings?: ProviderRuntimeSettings;
}

export class QoderACPAgentClient extends ACPAgentClient {
  constructor(options: QoderACPAgentClientOptions) {
    super({
      provider: "qoder",
      logger: options.logger,
      runtimeSettings: options.runtimeSettings,
      defaultCommand: ["npx", "-y", "@qoder-ai/qodercli@1.1.4", "--acp"],
      defaultModes: QODER_MODES,
      capabilities: QODER_CAPABILITIES,
    });
  }

  override async isAvailable(): Promise<boolean> {
    return super.isAvailable();
  }

  async getDiagnostic(): Promise<{ diagnostic: string }> {
    try {
      const launch = await resolveProviderLaunch({
        commandConfig: this.runtimeSettings?.command,
        defaultBinary: "qodercli",
      });
      const availability = await checkProviderLaunchAvailable(launch);

      return {
        diagnostic: formatProviderDiagnostic("Qoder", [
          ...(await buildCommandResolutionDiagnosticRows(launch, {
            knownBinaryNames: ["qodercli", "npx"],
          })),
          ...(await buildBinaryDiagnosticRows(launch, availability)),
        ]),
      };
    } catch (error) {
      return {
        diagnostic: formatProviderDiagnosticError("Qoder", error),
      };
    }
  }
}