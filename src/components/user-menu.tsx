'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import pkg from '../../package.json'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { IconCopy, IconExternalLink, IconGitHub } from '@/components/ui/icons'
import SettingIcon from '@/assets/images/settings.svg'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { SVG } from './ui/svg'

export function UserMenu() {
  const [host, setHost] = useState('')
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })
  const [installPrompt, setInstallPrompt] = useState<Event & { prompt: () => void }>()
  useEffect(() => {
    setHost(location.host)
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault()
      setInstallPrompt(event as Event & { prompt: () => void })
    })
  }, [])

  useEffect(() => {
    if (isCopied) {
      toast.success('تم النسخ بنجاح')
    }
  }, [isCopied])
  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="pl-0" variant="secondary">
            <div className="flex items-center justify-center text-xs font-medium uppercase rounded-full select-none h-7 w-7 shrink-0 bg-muted/50 text-muted-foreground">
              <SVG alt="settings" src={SettingIcon} width={20} />
            </div>
            <span className="ml-2">يثبت</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8} align="start" className="w-[180px] bg-background">
          <DropdownMenuItem
            onClick={() =>
              location.href='#dialog="settings"'
            }
            className="cursor-pointer"
          >
            معلومات المستخدم
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              location.href='#dialog="advanced"'
            }
            className="cursor-pointer"
          >
            إعدادات متقدمة
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              location.href='#dialog="voice"'
            }
            className="cursor-pointer"
          >
            إعدادات الصوت
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              location.href='#dialog="prompts"'
            }
            className="cursor-pointer"
          >
            إدارة الكلمات السريعة
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a
              href="https://github.com/weaigc/bingo/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full gap-2 cursor-pointer"
            >
              عنوان مفتوح المصدر
              <IconGitHub />
              <IconExternalLink className="w-3 h-3 ml-auto" />
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a
              href="https://huggingface.co/login?next=%2Fspaces%2Fhf4all%2Fbingo%3Fduplicate%3Dtrue%26visibility%3Dpublic"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full gap-2 cursor-pointer"
            >
              نسخ الموقع
              <IconExternalLink className="w-3 h-3 ml-auto" />
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex-col items-start">
            <div className="font-medium">معلومات الإصدار {pkg.version}</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {installPrompt && <DropdownMenuItem className="flex-col items-start">
            <div className="font-medium" onClick={() => installPrompt.prompt?.()}>قم بتثبيت Bing على سطح المكتب الخاص بك</div>
          </DropdownMenuItem>}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex-col items-start">
            <div className="font-medium">اسم نطاق الموقع</div>
            <div onClick={() => copyToClipboard(host)} className="flex gap-1 text-xs text-zinc-500 cursor-pointer">
              {host} <IconCopy />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
