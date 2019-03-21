import React from 'react'
import { Card, Button, InputGroup, FormControl } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const TransferConfirm = ({
  title,
  message,
  psw,
  onChange,
  onSubmit,
  onCancel,
}: {
  title: string
  message: string | React.ReactNode
  psw: string
  onChange: any
  onSubmit: any
  onCancel: any
}) => {
  const [t] = useTranslation()
  return (
    <Card
      onClick={(e: React.SyntheticEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <Card.Header>{title}</Card.Header>
      <Card.Body>
        <Card.Text>{`${t('send.thistransferwillsend')}: `}</Card.Text>
        {typeof message === 'string' ? <Card.Text>{message}</Card.Text> : message}
        <InputGroup>
          <FormControl placeholder={t('send.inputpasswordtoconfirm') as string} value={psw} onChange={onChange} />
        </InputGroup>
      </Card.Body>
      <Card.Footer className="text-muted">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Button onClick={onSubmit}>{t('common.confirm')}</Button>
          <Button variant="light" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        </div>
      </Card.Footer>
    </Card>
  )
}

export default TransferConfirm
