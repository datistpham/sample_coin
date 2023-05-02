// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import useLocales from 'src/hooks2/useLocales'

const LanguageDropdown = ({ settings, saveSettings }) => {
  // ** Hook
  const { i18n } = useTranslation()
  const { allLang, currentLang, onChangeLang } = useLocales();

  // ** Vars
  const { layout } = settings

  const handleLangItemClick = lang => {
    i18n.changeLanguage(lang)
  }

  return (
    <OptionsMenu
      icon={<Icon icon='mdi:translate' />}
      menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4, minWidth: 130 } } }}
      iconButtonProps={{ color: 'inherit', sx: { ...(layout === 'vertical' ? { mr: 0.75 } : { mx: 0.75 }) } }}
      options={[
        {
          text: 'English',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'en',
            onClick: () => {
              handleLangItemClick('en')
              onChangeLang("en")
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: 'Vietnamese',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'vi',
            onClick: () => {
              handleLangItemClick('vn')
              onChangeLang("vi")
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
      ]}
    />
  )
}

export default LanguageDropdown
