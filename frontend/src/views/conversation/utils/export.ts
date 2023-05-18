import { saveAs } from 'file-saver';

import { BaseConversationHistory } from '@/types/schema';
import { getChatModelNameTrans, getContentRawText } from '@/utils/chat';
import { getMessageListFromHistory } from '@/utils/conversation';

export const saveAsMarkdown = (convHistory: BaseConversationHistory) => {
  const messageList = getMessageListFromHistory(convHistory);
  let content = `# ${convHistory.title}\n\n`;
  const create_time = new Date(convHistory.create_time ? convHistory.create_time + 'Z' : new Date()).toLocaleString();
  content += `Date: ${create_time}\nModel: ${getChatModelNameTrans(convHistory.current_model || null)}\n`;
  content += 'generated by [ChatGPT Web Share](https://github.com/moeakwak/chatgpt-web-share)\n\n';
  content += '---\n\n';
  let index = 0;
  for (const message of messageList) {
    if (message.role === 'user') {
      // 选取第一行作为标题，最多50个字符，如果有省略则加上...
      // TODO 适配不同对话
      let title = getContentRawText(message).trim().split('\n')[0];
      if (title.length >= 50) {
        title = title.slice(0, 47) + '...';
      }
      content += `## ${++index}. ${title}\n\n`;
      content += `### User\n\n${message.content}\n\n`;
    } else {
      content += `### ChatGPT\n\n${message.content}\n\n`;
      content += '---\n\n';
    }
  }
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${convHistory.title} - ChatGPT history.md`);
};
