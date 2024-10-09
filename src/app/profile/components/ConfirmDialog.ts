import { Modal } from 'antd'
export function showConfirm(title: string, content: string): Promise<boolean> {
    const { confirm } = Modal;
    return new Promise((resolve) => {
        confirm({
            title,
            content,
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'Cancel',
            onOk() {
                resolve(true);  // User confirmed
            },
            onCancel() {
                resolve(false); // User canceled
            },
        });
    });
}

