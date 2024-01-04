import { useCallback, useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { toast } from 'react-hot-toast'
import { Switch } from '@headlessui/react'
import { hashAtom, historyAtom, isImageOnly } from '@/state'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ChunkKeys, parseCookies, extraCurlFromCookie, parseHeadersFromCurl, encodeHeadersToCookie, setCookie, resetCookies } from '@/lib/utils'
import { ExternalLink } from '../external-link'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { VoiceSetting } from './voice'
import { AdvancedSetting } from './advanced'

export function Settings() {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })
  const [loc, setLoc] = useAtom(hashAtom)
  const [curlValue, setCurlValue] = useState(extraCurlFromCookie(parseCookies(document.cookie, ChunkKeys)))
  const [imageOnly, setImageOnly] = useState(isImageOnly)
  const [enabledHistory, setHistory] = useAtom(historyAtom)

  useEffect(() => {
    if (isCopied) {
      toast.success('تم النسخ بنجاح')
    }
  }, [isCopied])

  const handleSwitchImageOnly = useCallback((checked: boolean) => {
    let headerValue = curlValue
    if (headerValue) {
      try {
        headerValue = atob(headerValue)
      } catch (e) { }
      if (!/^\s*curl ['"]https:\/\/www\.bing\.com\/turing\/captcha\/challenge['"]/.test(headerValue)) {
        toast.error('تنسيق معلومات المستخدم غير صحيح')
        return
      }
      setImageOnly(checked)
    } else {
      setImageOnly(checked)
    }
    if (checked) {
      setHistory(false)
    }
  }, [curlValue])

  if (loc === 'settings') {
    return (
      <Dialog open onOpenChange={() => setLoc('')} modal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>قم بإعداد معلومات المستخدم الخاصة بك</DialogTitle>
            <DialogDescription>
              الرجاء استخدام متصفح edge
              <ExternalLink
                href="https://www.bing.com"
              >
                افتح وقم بتسجيل الدخول إلى Bing
              </ExternalLink>
              ，ومن ثم فتحه مرة أخرى
              <ExternalLink href="https://www.bing.com/turing/captcha/challenge">تحدي يمسك口</ExternalLink>
              انقر على اليمين 》يفحص。فتح أدوات المطور，وجدت على شبكة الإنترنت تحدي يمسك口 》انقر بزر الماوس الأيمن للنسخ》نسخ ك cURL(bash)，لصق هنا，ثم احفظ。
              <div className="h-2" />
              أمثلة الرسومية والنصية：
              <ExternalLink href="https://github.com/weaigc/bingo#كيف تحصل على-bing_header">كيف تحصل على BING_HEADER</ExternalLink>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4">
          </div>
          <Input
            value={curlValue}
            placeholder="قم بملء معلومات المستخدم هنا，شكل: curl 'https://www.bing.com/turing/captcha/challenge' ..."
            onChange={e => {
              setCurlValue(e.target.value)
            }}
          />
          <div className="flex gap-2">
            <Switch
              checked={imageOnly}
              className={`${imageOnly ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
              onChange={(checked: boolean) => handleSwitchImageOnly(checked)}
            >
              <span
                className={`${imageOnly ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
            يتم استخدام معلومات الهوية فقط للرسم（يوصى باستخدامه）
          </div>

          <div className="flex gap-2">
            <Switch
              checked={enabledHistory}
              className={`${enabledHistory ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
              onChange={(checked: boolean) => setHistory(checked)}
            >
              <span
                className={`${enabledHistory ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
            تمكين التاريخ
          </div>

          <Button variant="ghost" className="bg-[#F5F5F5] hover:bg-[#F2F2F2]" onClick={() => copyToClipboard(btoa(curlValue))}>
            إنتقل إلى BING_HEADER ونسخ
          </Button>

          <Button variant="ghost" className="bg-[#F5F5F5] hover:bg-[#F2F2F2]" onClick={() => copyToClipboard(parseHeadersFromCurl(curlValue).cookie)}>
            يحصل على BING_COOKIE ونسخ
          </Button>

          <DialogFooter className="items-center">
            <Button
              variant="secondary"
              className="bg-[#c7f3ff] hover:bg-[#fdc7ff]"
              onClick={() => {
                let headerValue = curlValue
                if (headerValue) {
                  try {
                    headerValue = atob(headerValue)
                  } catch (e) { }
                  if (!/^\s*curl ['"]https:\/\/(www|cn)\.bing\.com\/turing\/captcha\/challenge['"]/.test(headerValue)) {
                    toast.error('تنسيق معلومات المستخدم غير صحيح')
                    return
                  }
                  encodeHeadersToCookie(headerValue).forEach(cookie => setCookie(cookie))
                } else {
                  resetCookies()
                }
                setCookie('IMAGE_ONLY', RegExp.$1 === 'cn' || imageOnly || !headerValue ? '1' : '0')

                toast.success('حفظ بنجاح')
                setLoc('')
                setTimeout(() => {
                  location.href = './'
                }, 2000)
              }}
            >
              يحفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  } else if (['voice', 'advanced'].includes(loc)) {
    return (
      <Dialog open onOpenChange={() => setLoc('')} modal>
        <DialogContent>
          { loc === 'voice' ? <VoiceSetting /> : <AdvancedSetting /> }
          <DialogFooter className="items-center">
            <Button
              variant="primary"
              onClick={() => {
                toast.success('حفظ بنجاح')
                setLoc('')
                setTimeout(() => {
                  location.href = './'
                }, 2000)
              }}
            >
              يحفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  return null
}
