# Keep Using Short Password on macOS (2024)

![image](https://file.onnttf.site/2024/1/30/1.png)

Following the release of **macOS Mojave 10.14**, Apple updated its password requirements to require users to set a password of at least 4 characters for their accounts. However, many people have become accustomed to using short passwords, such as `space`.

This article provides a solution for those who wish to keep using short passwords.

## Step 1: Clear the password policy

Open the `Terminal` application and type the following command:

```bash
pwpolicy -clearaccountpolicies
```

After pressing `Enter`, you will be prompted to enter the current password. It's important to note that the password you type is not visible. Simply press `Enter` when you have finished typing.

![image](https://file.onnttf.site/2024/1/30/2.png)

When the `Terminal` displays "Clearing global account policies", it will indicate that the password policy has been successfully cleared, as shown below:

![image](https://file.onnttf.site/2024/1/30/3.png)

## Step 2: Change your password

To change your password, click on the Apple logo in the top left corner of the screen, select **System Preferences** > **Users & Groups** and follow the on-screen instructions.

![image](https://file.onnttf.site/2024/1/30/4.png)

You can find that there are no password requirements during this process.

By following these steps, users can bypass the enforced password restrictions and use short passwords, such as `space`.
