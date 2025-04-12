import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import fs from 'fs/promises';

import type { Tool } from './tool';

const executeCustomScriptSchema = z.object({
  filePath: z.string().describe('The path to the JavaScript file to execute.'),
});

const executeCustomScript: Tool = {
  capability: 'core',
  schema: {
    name: 'browser_custom_javascript',
    description: 'Execute custom JavaScript from a file in the browser console',
    inputSchema: zodToJsonSchema(executeCustomScriptSchema),
  },

  handle: async (context, params) => {
    const validatedParams = executeCustomScriptSchema.parse(params);
    const scriptContent = await fs.readFile(validatedParams.filePath, 'utf-8');
    const tab = context.currentTab();
    return await tab.run(async () => {
      await tab.page.evaluate(scriptContent);
    }, {
      status: `Executed custom JavaScript from file: ${validatedParams.filePath}`,
    });
  },
};

export default [
  executeCustomScript,
];
