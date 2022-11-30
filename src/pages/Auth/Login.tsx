import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button, Checkbox, Form, message } from 'antd'
import styled from 'styled-components'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { AuthVariables, useLoginMutation } from '@apis'
import logo from '@assets/logo.png'
import FormInput, { FormPassword } from '@components/form/FormInput'
import LanguagePicker from '@components/LanguagePicker'
import { useAuthStore } from '@store'
import versionData from '../../version.json'

type Inputs = Omit<AuthVariables['login'], ''>

const Login = () => {
  const { t } = useTranslation()
  const { login, loginResponse, setKeepMeSignedIn } = useAuthStore()
  const formMethods = useForm<Inputs>({
    defaultValues: { login: loginResponse?.login || '' },
  })
  const { handleSubmit } = formMethods

  useEffect(() => {
    document.title = 'Login | SkyOffice'
  })

  const { mutate, isLoading } = useLoginMutation({
    onSuccess: data => login({ ...data, ...formMethods.getValues() }),
    onError: (e: any) => {
      if (e.message.includes('Network Error')) {
        message.error({ content: t('auth.login.networkError') })
      } else if (e.error === 10012) {
        message.error({ content: t('auth.login.noUser') })
      } else if (e.error === 10013) {
        message.error({ content: t('auth.login.wrongPassword') })
      } else message.error({ content: e.message })
    },
  })

  const handleLogin = handleSubmit(data => {
    // login({
    //   accessToken: '',
    //   expires: '',
    //   user: {
    //     userId: 1,
    //     userName: '',
    //   },
    // })
    mutate({ ...data })
  })
  const handleKeepMeSignIn = (e: any) => {
    if (e.target.checked) {
      setKeepMeSignedIn(true)
    } else {
      setKeepMeSignedIn(false)
    }
  }
  return (
    <Container>
      <div className="basis-1/5" />
      <Center>
        <div className="flex justify-between mb-4">
          <Logo src={logo} alt="logo" />
          <LanguagePicker />
        </div>
        <span className="font-semibold text-2xl text-gray-700">
          {t('auth.signIn')}
        </span>
        <FormProvider {...formMethods}>
          <Form
            wrapperCol={{ span: 24 }}
            // size="large"
            className="w-fulm"
            onFinish={handleLogin}
          >
            <FormInput
              name="login"
              rules={{ required: t('auth.login.required') }}
              inputProps={{
                placeholder: t('auth.login.placeholder'),
                prefix: <UserOutlined className="text-gray-400" />,
              }}
            />
            <FormPassword
              name="password"
              rules={{ required: t('auth.password.required') }}
              inputProps={{
                placeholder: t('auth.password.placeholder'),
                prefix: <LockOutlined className="text-gray-400" />,
              }}
            />
            <Form.Item className="mb-4">
              <Checkbox onClick={handleKeepMeSignIn}>
                {t('auth.keepMeSignedIn')}
              </Checkbox>
            </Form.Item>
            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="w-full"
              >
                {t('auth.signIn')}
              </Button>
            </Form.Item>
          </Form>
        </FormProvider>
      </Center>
      <span className="font-normal text-sm text-gray-400 mt-6">
        {t('common.version')}{' '}
        {`${versionData.buildMajor}.${versionData.buildMinor}.${versionData.buildRevision}`}
      </span>
    </Container>
  )
}

export default Login

const Container = styled.div.attrs({
  className: 'h-screen w-screen flex flex-col items-center bg-menu-bg',
})``

const Center = styled.div.attrs({
  className: 'bg-white p-6 rounded flex flex-col gap-4',
})`
  width: 428px;
  min-width: 428px;
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.08);
`

const Logo = styled.img`
  height: 40px;
  width: 123.2px;
`
