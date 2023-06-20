# Profile R2 Migrate

将配置文件以及配置文件使用的资源，迁移到 Cloudflare 的 R2


# 配置

1，访问 [Actions permissions](../../settings/actions) ，滚动到页面底部，将 `Workflow permissions` 选项修改为 `Read and write permissions` 后，点击 **Save** 按钮保存

2，点击 [Actions secrets and variables](../../settings/secrets/actions/new)，依次添加以下内容项

| Name字段 | Secret字段 |
| ----- | ----- |
| `CF_ACCOUNT_ID` | 参考 [Find zone and account IDs](https://developers.cloudflare.com/fundamentals/get-started/basic-tasks/find-account-and-zone-ids/)<br>**[可选]** Cloudflare 的 Account ID </br>如果不需要上传R2，则在 [.github/workflows/main.yml](./.github/workflows/main.yml) 文件中注释掉 `Upload files to R2 bucket` 相关代码</br>下同 |
| `CF_ACCESS_KEY` | 参考 [Generate an S3 Auth token](https://developers.cloudflare.com/r2/data-access/s3-api/tokens/) (下同)<br>**[可选]** 用于访问 Cloudflare R2 的 Access Key ID |
| `CF_SECRET_KEY` | **[可选]** 用于访问 Cloudflare R2 的 Secret ID |
| `R2_BUCKET` | **[可选]** Cloudflare R2 的 **存储桶名称** |

3, 访问 [Actions secrets and variables](../../settings/variables/actions/new)，添加以下变量

| Name字段 | Value字段 |
| ----- | ----- |
| `CLASH` | 填写 Clash 配置完整链接地址，一行一个 |
| `QUANTUMULT` | 填写 QUANTUMULT 配置完整链接地址，一行一个 |
| `ORIGIN` | 填写新的链接域名地址，如 `https://demo.example.com` |
