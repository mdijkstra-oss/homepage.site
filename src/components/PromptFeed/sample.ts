import { makePrompt } from '@/domain/content/prompt'

export const samplePrompt = makePrompt(
  'What is your favorite programming language?',
  [
    {
      id: 'reply-1',
      promptId: 'prompt-1',
      title: 'TypeScript',
      content:
        '# TypeScript\n\nI love TypeScript because of its **strong typing system** and great tooling.\n\n- Type safety\n- Great IDE support\n- Modern JavaScript features',
      completed: true,
      meta: {
        date: new Date('2023-01-01'),
        endDate: new Date('2023-01-15'),
        tags: ['typescript', 'javascript'],
      },
    },
    {
      id: 'reply-2',
      promptId: 'prompt-1',
      title: 'Python',
      content:
        '## Python\n\nPython is great for its *simplicity* and readability.\n\n```python\ndef hello_world():\n    print("Hello, World!")\n```',
      completed: true,
      meta: {
        date: new Date('2023-01-02'),
      },
    },
    {
      id: 'reply-3',
      promptId: 'prompt-1',
      title: 'React with TypeScript',
      content:
        'React with TypeScript is a powerful combination for building web applications. It provides type safety while maintaining the flexibility of React.',
      completed: true,
      meta: {
        date: new Date('2023-01-03'),
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png',
      },
    },
  ],
  'prompt-1',
)
