import React from 'react'
import './App.css'
import TextField from '@material-ui/core/TextField'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { ToastContainer, toast } from 'react-toastify'
import { SHA256, SHA512} from 'sha2'
import 'react-toastify/dist/ReactToastify.css'

function getSteps() {
  return ['Criptografia','Chave','Senha']
}

function App() {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  const steps = getSteps()
  const [key, setKey] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [type, setType] = React.useState('')
  const hasNavigatorClipboardAPI =
    navigator && navigator.clipboard && navigator.clipboard.writeText

  function handleOnChangeKey(e) {
    setKey(e.target.value)
  }

  function handleGeneratePasswordClick() {
    setActiveStep(activeStep + 1)
    sha(key, type)
  }

  function handleCopyClick() {
    if (hasNavigatorClipboardAPI) {
      navigator.clipboard.writeText(password)
      toast.success('Copiado', { autoClose: 2000 })
    }
  }

  function handleBackClick() {
    setActiveStep(activeStep - 1)
    setKey('')
  }

  function handleSha256Click() {
    setType('SHA-256')
    nextStep()
  }

  function handleSha512Click() {
    setType('SHA-512')
    nextStep()
  }

  function nextStep() {
    setActiveStep(activeStep + 1)
  }

  function sha(str, type) {
    if (type === 'SHA-512') {
      setPassword(SHA512(str).toString("hex"));
    } else {
      setPassword(SHA256(str).toString("hex"));
    }
  }

  function renderHashSelection() {
    return (
      <div className='form'>
        <Button
          className='selection-button'
          variant='outlined'
          color='primary'
          onClick={handleSha256Click}
        >
          SHA256
        </Button>
        <Button
          className='selection-button'
          variant='outlined'
          color='primary'
          onClick={handleSha512Click}
        >
          SHA512
        </Button>
      </div>
    )
  }

  function renderForm() {
    return (
      <div className='form'>
        <TextField
          id='outlined-basic'
          label='Chave'
          variant='outlined'
          value={key}
          onChange={handleOnChangeKey}
        />
        <div className='result-buttons'>
          <Button
            className='result-button'
            variant='outlined'
            color='primary'
            onClick={handleBackClick}
          >
            Voltar
          </Button>
          <Button
            variant='outlined'
            color='primary'
            onClick={handleGeneratePasswordClick}
          >
            Gerar Senha
          </Button>
        </div>
      </div>
    )
  }

  function renderResult() {
    return (
      <div className='result'>
        <TextField
          id='outlined-multiline-static'
          label='Senha'
          multiline
          rows={6}
          variant='outlined'
          value={password}
        />
        <div className='result-buttons'>
          <Button
            className='result-button'
            variant='outlined'
            color='primary'
            onClick={handleBackClick}
          >
            Voltar
          </Button>
          {hasNavigatorClipboardAPI && (
            <Button
              className='result-button'
              variant='outlined'
              color='primary'
              onClick={handleCopyClick}
            >
              Copiar
            </Button>
          )}
        </div>
      </div>
    )
  }

  function renderStep() {
    if (activeStep === 0) {
      return renderHashSelection()
    } else if (activeStep === 1) {
      return renderForm()
    } else {
      return renderResult()
    }
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <div className={classes.root}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {}
              const labelProps = {}
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </div>
      </header>
      {renderStep()}
      <ToastContainer />
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))

export default App
