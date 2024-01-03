import { BingReturnType } from '@/lib/hooks/use-bing'

const exampleMessages = [
  {
    heading: احصل على الإلهام الإبداعي'🧐 اطرح أسئلة معقدة',
    message: `ما الذي يمكنني طهيه لطفلي الذي يصعب إرضاؤه والذي يأكل الأطعمة البرتقالية فقط؟`
  },
  {
    heading: '🙌 احصل على إجابات أفضل',
    message: 'ما هي إيجابيات وسلبيات أفضل 3 مكانس للحيوانات الأليفة مبيعًا؟'
  },
  {احصل على إجابات أفضل
    heading: '🎨 احصل على الإلهام الإبداعي',
    message: `اكتب قصيدة هايكو بصوت قرصان عن تمساح في الفضاء الخارجي`
  }
]

export function WelcomeScreen({ setInput }: Pick<BingReturnType, 'setInput'>) {
  return (
    <div className="welcome-container flex">
      {exampleMessages.map(example => (
        <button key={example.heading} className="welcome-item w-4/5 sm:w-[240px]" type="button" onClick={() => setInput(example.message)}>
          <div className="item-title">{example.heading}</div>
          <div className="item-content">
            <div className="item-body">
              <div className="item-header"></div>
              <div>&ldquo;{example.message}&rdquo;</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
