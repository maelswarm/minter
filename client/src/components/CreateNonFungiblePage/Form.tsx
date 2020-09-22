/** @jsx jsx */
import { FC, useEffect, useState } from 'react';
import { jsx } from '@emotion/core';
import { Form, Input, Button, message } from 'antd';
import ImageIpfsUpload, { ImageIpfsUploadProps } from './ImageIpfsUpload';
import { IpfsContent } from '../../api/ipfsUploader';
import mkContracts from '../../api/contracts';

interface InputFormProps extends ImageIpfsUploadProps {
  ipfsContent?: IpfsContent;
  onFinish: () => void;
}

const InputForm: FC<InputFormProps> = ({ ipfsContent, onChange, onFinish }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleFinish = async (values: any) => {
    console.log('Submitted values: ', values);
    setLoading(true);
    const hideMessage = message.loading('Creating a new non-fungible token on blockchain...', 0);
    
    try {
      const contracts = await mkContracts();
      const nft = await contracts.nft();
      
      await nft.createToken({
        ...values,
        description: values.description || ''
      });
      
      onFinish();
    } catch (error) {
      message.error(error.message, 10) // Keep for 10 seconds
    } finally {
      setLoading(false)
      hideMessage();
    }
  };

  useEffect(() => {
      form.setFieldsValue({ ipfsCid: ipfsContent?.cid });
    }, 
    [ipfsContent, form]
  );

  return (
    <Form 
      form={form}
      onFinish={handleFinish}
      layout="vertical" 
      css={{ width: '30em' }}
    >
      <fieldset disabled={loading}>
        <Form.Item 
          label="Owner Address" 
          name="ownerAddress" 
          rules={[{ required: true, message: 'Please input an owner address!' }]}
        >
          <Input placeholder="tz1..." />
        </Form.Item>
        <Form.Item 
          label="Name" 
          name="name"
          rules={[{ required: true, message: 'Please input a name!' }]}
        >
          <Input placeholder="Tezos Logo Token" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea
            placeholder="Lorem ipsum"
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>
        <Form.Item 
          label="Symbol" 
          name="symbol"
          rules={[{ required: true, message: 'Please input a symbol!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Image Upload" name="image">
          <ImageIpfsUpload onChange={onChange} />
        </Form.Item>
        <Form.Item 
          label="IPFS Hash (CID)" 
          name="ipfsCid"
          rules={[{ required: true, message: 'Please upload an image!' }]}
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            shape="round"
            size="large"
            css={{ width: '12em' }}
          >
            Create
          </Button>
        </Form.Item>
      </fieldset>
    </Form>
  );
};

export default InputForm;
